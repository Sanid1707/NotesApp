using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.Common.DTOs;
using Notes.Entities;
using Notes.Repositories.Interfaces;
using Notes.Repository;

namespace Notes.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly NotesDbContext _context;

        public UserRepository(NotesDbContext context)
        {
            _context = context;
        }

        
 // Get All the Users to be displayed for choosing a Collaborator 
        public async Task<IEnumerable<UserDTO>> GetAllUsers()
        {
            try
            {
                // Fetching all users and project to UserDTO
                return await _context.Users
                    .Select(u => new UserDTO
                    {
                        UserId = u.UserId,
                        Username = u.Username,
                        Email = u.Email,
                        ProfilePicture = u.ProfilePicture
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return new List<UserDTO>();
            }
        }
        
        
  // This APi will help Display the data of the user on the Profile page 
        public async Task<UserDTO> GetUserById(Guid userId)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null) return null;

                return new UserDTO
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    ProfilePicture = user.ProfilePicture
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while fetching the user: {ex.Message}");
                return null;
            }
        }
        
     
        
 // API to Edit the user Info from the Profile Page 
        public async Task<bool> UpdateUser(UpdateUserDTO dto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
                if (user == null) return false;

                user.Username = dto.Username;
                user.Email = dto.Email;
                user.Role = dto.Role;
                user.ProfilePicture= dto.ProfilePicture;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the user: {ex.Message}");
                return false;
            }
        }
        

        
 // Deletes the specified user and reassigns ownership of shared notes or deletes them if no collaborators exist.
        public async Task<bool> DeleteUser(Guid userId)
        {
            try
            {// Fetching  the user
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null)
                {
                    Console.WriteLine($"User with UserId: {userId} not found.");
                    return false;
                }
                // Getting all shared notes where the user is the owner for safe deleting 
                var ownedSharedNotes = _context.UserNotes
                    .Where(un => un.UserId == userId && un.Role == NoteRoles.Owner)
                    .ToList();

                foreach (var sharedNote in ownedSharedNotes)
                {
                    // Find another collaborator for the note
                    var newOwner = await _context.UserNotes
                        .Where(un => un.NoteId == sharedNote.NoteId && un.UserId != userId)
                        .OrderBy(un => un.AccessGrantedAt) // Prefer the earliest collaborator
                        .FirstOrDefaultAsync();

                    if (newOwner != null)
                    {
                        // Reassign ownership
                        newOwner.Role = NoteRoles.Owner;
                        _context.UserNotes.Update(newOwner);
                    }
                    else
                    {
                        // If no collaborators exist, delete the note
                        var note = await _context.NotesTitles.FirstOrDefaultAsync(n => n.NoteId == sharedNote.NoteId);
                        if (note != null)
                        {
                            _context.NotesTitles.Remove(note);
                        }
                    }
                }

                // Delete all UserNotes for this user
                var userNotes = _context.UserNotes.Where(un => un.UserId == userId);
                _context.UserNotes.RemoveRange(userNotes);

                // Delete the user
                _context.Users.Remove(user);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"An error occurred while deleting the user: {ex.Message}");
                return false;
            }
        }
        
        
        
//This function allows us to add multiple collaborators  with individual statuses         
        public async Task<bool> AddMultipleCollaborators(AddMultipleCollaboratorsDTO dto)
        {
            try
            {
                // Validate if the note exists in the database
                var noteExists = await _context.NotesTitles.AnyAsync(n => n.NoteId == dto.NoteId);
                if (!noteExists)
                {
                    Console.WriteLine($"Error: Note with ID {dto.NoteId} does not exist.");
                    return false; // Return false if the note does not exist
                }

                foreach (var collaborator in dto.Collaborators)
                {
                    try
                    {
                        // Validate if the user exists in the database
                        var userExists = await _context.Users.AnyAsync(u => u.UserId == collaborator.UserId);
                        if (!userExists)
                        {
                            Console.WriteLine($"Error: User with ID {collaborator.UserId} does not exist.");
                            continue; // Skip to the next collaborator if the user does not exist
                        }

                        // Check if the collaborator already exists for the note
                        var existingCollaborator = await _context.UserNotes
                            .FirstOrDefaultAsync(un => un.NoteId == dto.NoteId && un.UserId == collaborator.UserId);

                        if (existingCollaborator != null)
                        {
                            // Update existing collaborator's properties only if they are provided
                            if (collaborator.Role.HasValue)
                            {
                                existingCollaborator.Role = collaborator.Role.Value;
                            }

                            if (collaborator.Status.HasValue)
                            {
                                existingCollaborator.Status = collaborator.Status.Value;
                            }

                            existingCollaborator.AccessGrantedAt = DateTime.UtcNow; // Always update the access timestamp
                            _context.UserNotes.Update(existingCollaborator);
                        }
                        else
                        {
                            // Add a new collaborator to the note
                            var newCollaborator = new UserNotes
                            {
                                UserId = collaborator.UserId,
                                NoteId = dto.NoteId,
                                Role = collaborator.Role ?? NoteRoles.Editor, // Default to Viewer if Role is not provided
                                AccessGrantedAt = DateTime.UtcNow,
                                Status = collaborator.Status ?? NoteStatus.Active // Default to Active if Status is not provided
                            };

                            await _context.UserNotes.AddAsync(newCollaborator);
                        }
                    }
                    catch (Exception innerEx)
                    {
                        // Log specific error details for a single collaborator
                        Console.WriteLine($"Error processing collaborator {collaborator.UserId}: {innerEx.Message}");
                        continue; // Continue processing other collaborators
                    }
                }

                // Save all changes to the database after processing all collaborators
                await _context.SaveChangesAsync();
                return true; // Return true if all operations are successful
            }
            catch (DbUpdateException dbEx)
            {
                // Handle database update-specific errors
                Console.WriteLine($"Database update error: {dbEx.Message}");
                return false;
            }
            catch (Exception ex)
            {
                // Handle general errors
                Console.WriteLine($"An unexpected error occurred while adding collaborators: {ex.Message}");
                return false;
            }
        }
        
        
        // Function to edit the note 
        public async Task<bool> EditCollaborators(AddMultipleCollaboratorsDTO dto)
{
    try
    {
        // Validate if the note exists in the database
        var noteExists = await _context.NotesTitles.AnyAsync(n => n.NoteId == dto.NoteId);
        if (!noteExists)
        {
            Console.WriteLine($"Error: Note with ID {dto.NoteId} does not exist.");
            return false; // Return false if the note does not exist
        }

        foreach (var collaborator in dto.Collaborators)
        {
            try
            {
                // Check if the collaborator already exists for the note
                var existingCollaborator = await _context.UserNotes
                    .FirstOrDefaultAsync(un => un.NoteId == dto.NoteId && un.UserId == collaborator.UserId);

                if (existingCollaborator != null)
                {
                    // Update the collaborator's properties if they are provided
                    if (collaborator.Role.HasValue)
                    {
                        existingCollaborator.Role = collaborator.Role.Value;
                    }

                    if (collaborator.Status.HasValue)
                    {
                        existingCollaborator.Status = collaborator.Status.Value;
                    }

                    existingCollaborator.AccessGrantedAt = DateTime.UtcNow; // Update the access timestamp
                    _context.UserNotes.Update(existingCollaborator);
                }
                else
                {
                    // If the collaborator does not exist, log and skip
                    Console.WriteLine($"Collaborator with User ID {collaborator.UserId} does not exist for Note ID {dto.NoteId}.");
                    continue;
                }
            }
            catch (Exception innerEx)
            {
                // Log specific error details for a single collaborator
                Console.WriteLine($"Error processing collaborator {collaborator.UserId}: {innerEx.Message}");
                continue; // Continue processing other collaborators
            }
        }

        // Save all changes to the database after processing all collaborators
        await _context.SaveChangesAsync();
        return true; // Return true if all operations are successful
    }
    catch (DbUpdateException dbEx)
    {
        // Handle database update-specific errors
        Console.WriteLine($"Database update error: {dbEx.Message}");
        return false;
    }
    catch (Exception ex)
    {
        // Handle general errors
        Console.WriteLine($"An unexpected error occurred while editing collaborators: {ex.Message}");
        return false;
    }
}
        
        
        
        
        public async Task<bool> DeleteCollaborators(AddMultipleCollaboratorsDTO dto)
{
    try
    {
        // Validate if the note exists in the database
        var noteExists = await _context.NotesTitles.AnyAsync(n => n.NoteId == dto.NoteId);
        if (!noteExists)
        {
            Console.WriteLine($"Error: Note with ID {dto.NoteId} does not exist.");
            return false; // Return false if the note does not exist
        }

        foreach (var collaborator in dto.Collaborators)
        {
            try
            {
                // Check if the collaborator exists for the note
                var existingCollaborator = await _context.UserNotes
                    .FirstOrDefaultAsync(un => un.NoteId == dto.NoteId && un.UserId == collaborator.UserId);

                if (existingCollaborator != null)
                {
                    // Remove the collaborator
                    _context.UserNotes.Remove(existingCollaborator);
                }
                else
                {
                    // Log if the collaborator does not exist
                    Console.WriteLine($"Collaborator with User ID {collaborator.UserId} does not exist for Note ID {dto.NoteId}.");
                    continue; // Skip to the next collaborator
                }
            }
            catch (Exception innerEx)
            {
                // Log specific error details for a single collaborator
                Console.WriteLine($"Error processing deletion for collaborator {collaborator.UserId}: {innerEx.Message}");
                continue; // Continue processing other collaborators
            }
        }

        // Save all changes to the database after processing all collaborators
        await _context.SaveChangesAsync();
        return true; // Return true if all operations are successful
    }
    catch (DbUpdateException dbEx)
    {
        // Handle database update-specific errors
        Console.WriteLine($"Database update error: {dbEx.Message}");
        return false;
    }
    catch (Exception ex)
    {
        // Handle general errors
        Console.WriteLine($"An unexpected error occurred while deleting collaborators: {ex.Message}");
        return false;
    }
}
        
        
        
        
    }
    
    
         
    
}