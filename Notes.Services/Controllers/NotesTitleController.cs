using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Repositories.Interrfaces;

namespace Notes.Controllers
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
        
        
        [HttpGet("get-all-notes/{userId}")]
        public async Task<IActionResult> GetAllNotesTitle(Guid userId)
        {
            try
            {
                var notes = await _notesTitleRepository.GetAllNotes(userId);
                return Ok(notes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        
        [HttpPost]// POST: api/notesTitle
        public async Task<IActionResult> AddNotesTitle([FromBody] CreateNoteTitle dto)
        {
            try
            {
                var result = await _notesTitleRepository.AddNotes(dto);

                if (result is OkObjectResult okResult)
                {
                    return Ok(okResult.Value);
                }
                else
                {
                    return result;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPut] // PUT: api/notesTitle
        public async Task<IActionResult> UpdateNotesTitle([FromBody] UpdateNoteTitle dto)
        {
            try
            {
                var result = await _notesTitleRepository.UpdateNotes(dto);

                if (result is OkObjectResult okResult)
                {
                    return Ok(okResult.Value);
                }
                else
                {
                    return result;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred:  {ex.Message}" });
            }
        }

        [HttpDelete] // DELETE: api/notesTitles
        public async Task<IActionResult> DeleteNotesTitle(Guid noteId)
        {
            try
            {
                var result = await _notesTitleRepository.DeleteNotes(noteId);

                if (result is OkObjectResult okResult)
                {
                    return Ok(okResult.Value);
                }
                else
                {
                    return result;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}