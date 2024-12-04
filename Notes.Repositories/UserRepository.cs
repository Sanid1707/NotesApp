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
        
    }
}