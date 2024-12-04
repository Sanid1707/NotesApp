﻿using Microsoft.AspNetCore.Mvc;
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
        
        
        [HttpPost("add-note")]
        public async Task<IActionResult> AddNote([FromBody] EditNoteTitleDTO dto)
        {
            try
            {
                var result = await _notesTitleRepository.AddNote(dto);
                return result;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        [HttpPut("edit-note")]
        public async Task<IActionResult> EditNoteTitle([FromBody] EditNoteTitleDTO dto)
        {
            try
            {
                var result = await _notesTitleRepository.EditNoteTitle(dto);
                return result;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        

        [HttpDelete("delete-note")]
        public async Task<IActionResult> DeleteNoteTitle([FromBody] DeleteNoteDTO dto)
        {
            try
            {
                var result = await _notesTitleRepository.DeleteNoteTitle(dto);
                return result;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}