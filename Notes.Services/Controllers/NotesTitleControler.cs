using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;
using Notes.Repositories.Interrfaces;
namespace Notes.Services.Controllers
{
    public class NotesTitleControler
    {
        [ApiController]
		[Route("api/[controller]")]
		public class NotesTitleController : ControllerBase
		{
			private readonly INotesTitleRepository _notesTitleRepository;

			public NotesTitleController(INotesTitleRepository notesTitleRepository)
			{
				_notesTitleRepository = notesTitleRepository;
			}

			// GET: api/notesTitle
			[HttpGet]
			public IActionResult GetAllNotesTitle(Guid userId)
			{
				try
				{
					var notesTitle = _notesTitleRepository.GetAllNotes(userId);
					return Ok(notesTitle);
				}
				catch (Exception ex)
				{
					return StatusCode(500, $"An error occurred: {ex.Message}");
				}
			}

			// POST: api/notesTitle
			[HttpPost]
			public async Task<IActionResult> AddNotesTitle([FromBody] CreateNoteTitle dto)
			{
				try
				{
					var result = await _notesTitleRepository.AddNotes(dto);

					// Check if the result is OkObjectResult
					if (result is OkObjectResult okResult)
					{
						return Ok(okResult.Value); // Return success with the value
					}
					else
					{
						// For any other ObjectResult type (e.g., BadRequest, Conflict, etc.)
						return result;
					}
				}
				catch (Exception ex)
				{
					// Handle unexpected exceptions
					return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
				}
			}

			// PUT: api/notesTitle
			[HttpPut]
			public async Task<IActionResult> UpdateNotesTitle([FromBody] UpdateNoteTitle dto)
			{
				try
				{
					var result = await _notesTitleRepository.UpdateNotes(dto);

					// Check if the result is OkObjectResult
					if (result is OkObjectResult okResult)
					{
						return Ok(okResult.Value); // Return success with the value
					}
					else
					{
						// For any other ObjectResult type (e.g., BadRequest, Conflict, etc.)
						return result;
					}
				}
				catch (Exception ex)
				{
					// Handle unexpected exceptions
					return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
				}
			}

			// DELETE: api/notesTitle
			[HttpDelete]
			public async Task<IActionResult> DeleteNotesTitle(Guid noteId)
			{
				try
				{
					var result = await _notesTitleRepository.DeleteNotes(noteId);

					// Check if the result is OkObjectResult
					if (result is OkObjectResult okResult)
					{
						return Ok(okResult.Value); // Return success with the value
					}
					else
					{
						// For any other ObjectResult type (e.g., BadRequest, Conflict, etc.)
						return result;
					}
				}
				catch (Exception ex)
				{
					// Handle unexpected exceptions
					return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
				}
			}

		}
	}
}
