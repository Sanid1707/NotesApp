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