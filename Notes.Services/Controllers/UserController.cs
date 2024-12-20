using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Repositories.Interfaces;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("get-all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userRepository.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        

        [HttpGet("get-user/{userId}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetUserById(userId);
                if (user == null)
                {
                    return NotFound(new { success = false, message = "User not found." });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        

        [HttpPut("update-user")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDTO dto)
        {
            try
            {
                var result = await _userRepository.UpdateUser(dto);
                return result
                    ? Ok(new { success = true, message = "User updated successfully." })
                    : NotFound(new { success = false, message = "User not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        

        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            try
            {
                var result = await _userRepository.DeleteUser(userId);
                if (result)
                {
                    return Ok(new { success = true, message = "User deleted successfully." });
                }
                else
                {
                    return NotFound(new { success = false, message = "User not found." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        [HttpPost("add-multiple-collaborators")]
        public async Task<IActionResult> AddMultipleCollaborators([FromBody] AddMultipleCollaboratorsDTO dto)
        {
            try
            {
                var result = await _userRepository.AddMultipleCollaborators(dto);
                if (result)
                {
                    return Ok(new { success = true, message = "Collaborators added/updated successfully." });
                }
                return BadRequest(new { success = false, message = "Failed to add/update collaborators." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        [HttpPut("edit-collaborators")]
        public async Task<IActionResult> EditCollaborators([FromBody] AddMultipleCollaboratorsDTO dto)
        {
            try
            {
                var result = await _userRepository.EditCollaborators(dto);
                if (result)
                {
                    return Ok(new { success = true, message = "Collaborators updated successfully." });
                }
                return BadRequest(new { success = false, message = "Failed to update collaborators." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        
        
        [HttpDelete("delete-collaborators")]
        public async Task<IActionResult> DeleteCollaborators([FromBody] AddMultipleCollaboratorsDTO dto)
        {
            try
            {
                var result = await _userRepository.DeleteCollaborators(dto);
                if (result)
                {
                    return Ok(new { success = true, message = "Collaborators deleted successfully." });
                }
                return BadRequest(new { success = false, message = "Failed to delete collaborators." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}