using System;
using System.Threading.Tasks;
using Notes.Repositories.Interrfaces;
using Notes.Repository;
using Notes.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Notes.Repositories
{
    public class NotesTitleRepository : INotesTitleRepository
    {
        private readonly NotesDbContext _context;

        public NotesTitleRepository(NotesDbContext context)
        {
            _context = context;
        }

     
        
public async Task<IActionResult> AddNote(EditNoteTitleDTO dto)
{
    try
    {
        // Validate the input
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Tag))
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "Title and Tag are required."
            });
        }

        if (dto.UserId == Guid.Empty)
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "Invalid User ID."
            });
        }

        // Generate a new GUID for the NoteId
        var newNoteId = Guid.NewGuid();

        // Create a new NotesTitle entity
        var newNote = new Notes.Entities.NotesTitle
        {
            NoteId = newNoteId,
            Title = dto.Title,
            Tag = dto.Tag,
            Favourite = (byte)dto.Favourite,
            DateCreated = DateTime.UtcNow,
            DateEdited = DateTime.UtcNow,
            IsActive = 1
        };

        // Add the note to the database
        await _context.NotesTitles.AddAsync(newNote);

        // Create a new UserNotes entry to set the user as the owner
        var userNote = new Notes.Entities.UserNotes
        {
            UserId = dto.UserId,
            NoteId = newNoteId,
            Role = NoteRoles.Owner,
            AccessGrantedAt = DateTime.UtcNow
        };

        // Add the UserNotes entry
        await _context.UserNotes.AddAsync(userNote);

        // Create a new Content row associated with the NoteId
        var newContent = new Notes.Entities.Content
        {
            NoteId = newNoteId,
            FormattedContent = string.Empty, // Initialize with empty content
            ContentType = "HTML",            // Default content type
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Add the Content row to the database
        await _context.Content.AddAsync(newContent);

        // Save all changes to the database
        await _context.SaveChangesAsync();

        return new OkObjectResult(new
        {
            success = true,
            message = "Note and content added successfully.",
            noteId = newNoteId
        });
    }
    catch (Exception ex)
    {
        return new ObjectResult(new
        {
            success = false,
            message = $"An error occurred: {ex.Message}"
        })
        {
            StatusCode = 500
        };
    }
}
        
        public async Task<IEnumerable<ReadNoteDTO>> GetAllActiveNotes(Guid userId)
        {
            try
            {
                // Fetch all notes where the user is either the owner or a collaborator and the note is active
                var notes = await _context.NotesTitles
                    .Include(n => n.UserNotes) // Include collaborators
                    .ThenInclude(un => un.User)
                    .Where(n => n.UserNotes.Any(un => un.UserId == userId && un.Status == NoteStatus.Active)) // Filter for active notes related to the user
                    .ToListAsync();

                // Transform notes into ReadNoteDTO
                var notesDto = notes.Select(n => new ReadNoteDTO
                {
                    NoteId = n.NoteId,
                    Title = n.Title,
                    Tag = n.Tag,
                    DateCreated = n.DateCreated,
                    DateEdited = n.DateEdited,
                    Favourite = n.Favourite,
                    Collaborators = n.UserNotes
                        .Where(c => c.UserId != userId) // Exclude the current user from collaborators
                        .Select(c => new CollaboratorDTO
                        {
                            UserId = c.User.UserId,
                            Username = c.User.Username,
                            Role= c.Role,
                        })
                        .ToList()
                }).ToList();

                return notesDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred: {ex.Message}", ex);
            }
        }
   
        // Only Users that have the permission to edit the Note are the Editor and the Owner 
         public async Task<IActionResult> EditNoteTitle(EditNoteTitleDTO dto)
{
    try
    {
        // Check if the user has permission to edit the note
        var userNote = await _context.UserNotes
            .FirstOrDefaultAsync(un => un.UserId == dto.UserId && un.NoteId == dto.NoteId &&
                                       (un.Role == NoteRoles.Owner || un.Role == NoteRoles.Editor));

        if (userNote == null)
        {
            return new UnauthorizedObjectResult(new
            {
                success = false,
                message = "User does not have permission to edit this note."
            });
        }

        // Fetch the note to update
        var note = await _context.NotesTitles.FirstOrDefaultAsync(n => n.NoteId == dto.NoteId);

        if (note == null)
        {
            return new NotFoundObjectResult(new
            {
                success = false,
                message = "Note not found."
            });
        }

        // Update note properties
        note.Title = dto.Title;
        note.Tag = dto.Tag;

        // Assign nullable properties safely
        if (dto.Favourite.HasValue)
        {
            note.Favourite = (byte)dto.Favourite.Value;
        }

        if (dto.DateEdited.HasValue)
        {
            note.DateEdited = dto.DateEdited.Value;
        }
        else
        {
            note.DateEdited = DateTime.UtcNow; // Default to current UTC time
        }

        // Update note status if provided
        if (dto.Status.HasValue)
        {
            userNote.Status = dto.Status.Value;
        }

        _context.NotesTitles.Update(note);
        _context.UserNotes.Update(userNote); // Save the updated status
        await _context.SaveChangesAsync();

        return new OkObjectResult(new
        {
            success = true,
            message = "Note updated successfully."
        });
    }
    catch (Exception ex)
    {
        return new ObjectResult(new
        {
            success = false,
            message = $"An error occurred: {ex.Message}"
        })
        {
            StatusCode = 500
        };
    }
}
        
        //Only the Owner has the permission to Delete the Following note 
        public async Task<IActionResult> DeleteNoteTitle(DeleteNoteDTO dto)
        {
            try
            {
                // Check if the user is the owner of the note
                var userNote = await _context.UserNotes
                    .FirstOrDefaultAsync(un => un.UserId == dto.UserId && un.NoteId == dto.NoteId && un.Role == NoteRoles.Owner);

                if (userNote == null)
                {
                    return new UnauthorizedObjectResult(new
                    {
                        success = false,
                        message = "User does not have permission to delete this note."
                    });
                }

                // Fetch the note to delete
                var note = await _context.NotesTitles.FirstOrDefaultAsync(n => n.NoteId == dto.NoteId);

                if (note == null)
                {
                    return new NotFoundObjectResult(new
                    {
                        success = false,
                        message = "Note not found."
                    });
                }

                // Delete the note (Content will cascade due to FK constraint)
                _context.NotesTitles.Remove(note);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Note and associated content deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new ObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                })
                {
                    StatusCode = 500
                };
            }
        }
   
        
        //only reason make a separate  function and the API controller was because of the front-end design , could have filtered using conditions but choose not to . 
        public async Task<IEnumerable<ReadNoteDTO>> GetArchivedNotes(Guid userId)
        {
            try
            {
                // Fetch all notes where the user is either the owner or a collaborator and the note is archived
                var notes = await _context.NotesTitles
                    .Include(n => n.UserNotes) // Include collaborators
                    .ThenInclude(un => un.User)
                    .Where(n => n.UserNotes.Any(un => un.UserId == userId && un.Status == NoteStatus.Archive)) // Filter for archived notes related to the user
                    .ToListAsync();

                // Transform notes into ReadNoteDTO
                var notesDto = notes.Select(n => new ReadNoteDTO
                {
                    NoteId = n.NoteId,
                    Title = n.Title,
                    Tag = n.Tag,
                    DateCreated = n.DateCreated,
                    DateEdited = n.DateEdited,
                    Favourite = n.Favourite,
                    Collaborators = n.UserNotes
                        .Where(c => c.UserId != userId) // Exclude the current user from collaborators
                        .Select(c => new CollaboratorDTO
                        {
                            UserId = c.User.UserId,
                            Username = c.User.Username
                        })
                        .ToList()
                }).ToList();

                return notesDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred: {ex.Message}", ex);
            }
        }
        
        // Created to speed up the process on the front-end
        public async Task<IActionResult> ToggleFavourite(Guid noteId, Guid userId)
        {
            try
            {
                // Fetch the note and validate permissions
                var userNote = await _context.UserNotes
                    .FirstOrDefaultAsync(un => un.UserId == userId && un.NoteId == noteId &&
                                               (un.Role == NoteRoles.Owner || un.Role == NoteRoles.Editor));

                if (userNote == null)
                {
                    return new UnauthorizedObjectResult(new
                    {
                        success = false,
                        message = "User does not have permission to update this note."
                    });
                }

                // Fetch the note
                var note = await _context.NotesTitles.FirstOrDefaultAsync(n => n.NoteId == noteId);

                if (note == null)
                {
                    return new NotFoundObjectResult(new
                    {
                        success = false,
                        message = "Note not found."
                    });
                }

                // Toggle favourite status
                note.Favourite = note.Favourite == 1 ? (byte)0 : (byte)1;
                note.DateEdited = DateTime.UtcNow;

                _context.NotesTitles.Update(note);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    favourite = note.Favourite,
                    message = "Favourite status updated successfully."
                });
            }
            catch (Exception ex)
            {
                return new ObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                })
                {
                    StatusCode = 500
                };
            }
        }
        
        
       
    }
}