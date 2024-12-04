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


    }
}