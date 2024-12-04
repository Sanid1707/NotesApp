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

        // Add Note Method
        public async Task<IActionResult> AddNotes(CreateNoteTitle dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.Title))
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Title is required."
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

                var note = new Notes.Entities.NotesTitle
                {
                    Title = dto.Title,
                    NoteId = Guid.NewGuid(),
                    // UserId = dto.UserId,
                    // Tag = dto.Tag,
                    // Favourite = dto.Favourite,
                    DateCreated = DateTime.UtcNow,
                    DateEdited = DateTime.UtcNow,
                    IsActive = 1
                };

                await _context.NotesTitles.AddAsync(note);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Note added successfully.",
                    noteId = note.NoteId
                });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                });
            }
        }

        // Delete Note Method
        public async Task<IActionResult> DeleteNotes(Guid noteId)
        {
            try
            {
                var note = await _context.NotesTitles.FindAsync(noteId);
                if (note == null)
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Note not found."
                    });
                }

                _context.NotesTitles.Remove(note);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Note deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                });
            }
        }

        // Get All Notes Method
        // public async Task<IActionResult> GetAllNotes(Guid userId)
        // {
        //     try
        //     {
        //         var notes = await _context.NotesTitles
        //             .Where(n => n.UserId == userId && n.IsActive == 1)
        //             .ToListAsync();
        //
        //         return new OkObjectResult(notes);
        //     }
        //     catch (Exception ex)
        //     {
        //         return new BadRequestObjectResult(new
        //         {
        //             success = false,
        //             message = $"An error occurred: {ex.Message}"
        //         });
        //     }
        // }
        
        
        // public async Task<IEnumerable<ReadNoteDTO>> GetAllNotes(Guid userId)
        // {
        //     try
        //     {
        //         // Validate user existence
        //         var userExists = await _context.Users.AnyAsync(u => u.UserId == userId && u.IsActive == 1);
        //         if (!userExists)
        //         {
        //             throw new Exception("User not found or inactive.");
        //         }
        //
        //         // Fetch notes directly owned by the user
        //         var ownedNotes = await _context.NotesTitles
        //             .Where(n => n.UserNotes.Any(un => un.UserId == userId)) // Notes owned by the user
        //             .Include(n => n.UserNotes)
        //             .ThenInclude(un => un.User)
        //             .ToListAsync();
        //
        //         // Fetch notes where the user is a collaborator
        //         var sharedNotes = await _context.UserNotes
        //             .Where(un => un.UserId == userId) // Notes shared with the user
        //             .Select(un => un.NotesTitle)
        //             .Include(n => n.UserNotes)
        //             .ThenInclude(un => un.User)
        //             .ToListAsync();
        //
        //         // Combine owned and shared notes
        //         var allNotes = ownedNotes.Concat(sharedNotes).Distinct().ToList();
        //
        //         // Transform notes into ReadNoteDTO
        //         var notesDto = allNotes.Select(n => new ReadNoteDTO
        //         {
        //             NoteId = n.NoteId,
        //             Title = n.Title,
        //             Tag = n.Tag,
        //             Favourite = n.Favourite,
        //             Collaborators = n.UserNotes
        //                 .Where(c => c.UserId != userId) // Exclude the current user from collaborators
        //                 .Select(c => new CollaboratorDTO
        //                 {
        //                     UserId = c.User.UserId,
        //                     Username = c.User.Username
        //                 })
        //                 .ToList()
        //         }).ToList();
        //
        //         return notesDto;
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception($"An error occurred: {ex.Message}", ex);
        //     }
        // }
        public async Task<IEnumerable<ReadNoteDTO>> GetAllNotes(Guid userId)
        {
            try
            {
                // Fetch all notes where the user is either the owner or a collaborator
                var notes = await _context.NotesTitles
                    .Include(n => n.UserNotes) // Include collaborators
                    .ThenInclude(un => un.User)
                    .Where(n => n.UserNotes.Any(un => un.UserId == userId)) // Filter for notes related to the user
                    .ToListAsync();

                // Transform notes into ReadNoteDTO
                var notesDto = notes.Select(n => new ReadNoteDTO
                {
                    NoteId = n.NoteId,
                    Title = n.Title,
                    Tag = n.Tag,
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
        
        
        // Update Note Method
        public async Task<IActionResult> UpdateNotes(UpdateNoteTitle dto)
        {
            try
            {
                var note = await _context.NotesTitles.FindAsync(dto.NoteId);
                if (note == null)
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Note not found."
                    });
                }

                note.Title = dto.Title;
                // note.Tag = dto.Tag;
                // note.Favourite = dto.Favourite;
                note.DateEdited = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Note updated successfully."
                });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                });
            }
        }
    }
}