using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Notes.DTOs;
using Notes.Entities;
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
                return NotFound(new { message = "Content not found." });
            }

            // Map to ContentDto
            var contentDto = new ContentDto
            {
                NoteId = content.NoteId,
                FormattedContent = content.FormattedContent,
                ContentType = content.ContentType,
                UpdatedAt = content.UpdatedAt
            };

            return Ok(contentDto);
        }

        // PUT: api/content/{noteId}
        [HttpPut("{noteId}")]
        public async Task<IActionResult> UpdateContent(Guid noteId, [FromBody] ContentUpdateDto contentUpdateDto)
        {
            if (contentUpdateDto == null || string.IsNullOrWhiteSpace(contentUpdateDto.FormattedContent))
            {
                return BadRequest(new { message = "Invalid content data." });
            }

            var updatedContent = await _contentRepository.UpdateContentAsync(
                noteId,
                contentUpdateDto.FormattedContent,
                contentUpdateDto.ContentType
            );

            return Ok(new ContentDto
            {
                NoteId = updatedContent.NoteId,
                FormattedContent = updatedContent.FormattedContent,
                ContentType = updatedContent.ContentType,
                UpdatedAt = updatedContent.UpdatedAt
            });
        }
    }
}