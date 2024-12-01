using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Notes.Repositories.Interrfaces;
using Notes.Repository;
using Notes.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Notes.Repositories
{
	public class NotesTitleRepository : INotesTitleRepository
	{
		private readonly NotesDbContext _context;

		public NotesTitleRepository(NotesDbContext context)
		{
			_context = context;
			
		}
		// add note method
		public async Task<IActionResult> AddNotes(CreateNoteTitle dto)
		{
			try
			{

			
				// validate input
				if (string.IsNullOrWhiteSpace(dto.Title))
				{
					return new BadRequestObjectResult(new
					{
						success = false,
						message = "Title is required."
					});
				}

				// invalid guid check
				if (dto.UserId == Guid.Empty)
				{
					return new BadRequestObjectResult(new
					{
						success = false,
						message = "Invalid User Id."
					});
				}



				var note = new Notes.Entities.NotesTitle
				{
					Title = dto.Title,
					NoteId = Guid.NewGuid(),
					UserId = dto.UserId,
					Tag = dto.tag,
					favourite = dto.favourite,
					DateCreated = DateTime.Now,
					DateEditied = DateTime.Now,

					IsActive = 1

				};
				await _context.NotesTitles.AddAsync(note);
				await _context.SaveChangesAsync();
				return new OkObjectResult(new
				{
					success = true,
					message = "note title added successfully.",
					noteId = note.NoteId,
				});

				
			}

			catch
			(Exception ex)
			{
				return new BadRequestObjectResult(new
				{
					success = false,
					message = ex.Message
				});
			}
			throw new NotImplementedException();
		}


		// delete note method
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
			catch
			(Exception ex)
			{
				return new BadRequestObjectResult(new
				{
					success = false,
					message = ex.Message
				});
			}
		}

		// display all notes method
		public async Task<IEnumerable<Notes.Entities.NotesTitle>> GetAllNotes(Guid userId)
		{
			return await _context.NotesTitles.Where(n => n.UserId == userId).ToListAsync();
		}


		// update note method
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
				note.Tag = dto.tag;
				note.favourite = dto.favourite;
				note.DateEditied = DateTime.Now;
				await _context.SaveChangesAsync();
				return new OkObjectResult(new
				{
					success = true,
					message = "Note updated successfully."
				});
			}
			catch
			(Exception ex)
			{
				return new BadRequestObjectResult(new
				{
					success = false,
					message = ex.Message
				});
			}
		}

	}
}
