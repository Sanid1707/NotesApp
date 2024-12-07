using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Notes.DTOs;
using Notes.Repositories.Interfaces;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/content")]
    public class ContentController : ControllerBase
    {
        private readonly IContentRepository _contentRepository;

        public ContentController(IContentRepository contentRepository)
        {
            _contentRepository = contentRepository;
        }

        // GET: api/content/{noteId}
        [HttpGet("{noteId}")]
        public async Task<IActionResult> GetContent(Guid noteId)
        {
            var content = await _contentRepository.GetContentByNoteIdAsync(noteId);

            if (content == null)
            {
                return NotFound(new { success = false, message = "Content not found." });
            }

            return Ok(new { success = true, data = content });
        }

        
        // PUT: api/content/{noteId}
        [HttpPut("{noteId}")]
        public async Task<IActionResult> UpdateContent(Guid noteId, [FromBody] ContentUpdateDto contentUpdateDto)
        {
            if (contentUpdateDto == null || string.IsNullOrWhiteSpace(contentUpdateDto.FormattedContent))
            {
                return BadRequest(new { success = false, message = "Invalid content data." });
            }

            var updatedContent = await _contentRepository.UpdateContentAsync(noteId, contentUpdateDto);

            return Ok(new { success = true, message = "Content updated successfully.", data = updatedContent });
        }
    }
}