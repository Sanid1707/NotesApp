// Controllers/UserController.cs
using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;
using Notes.Repository;

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
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest dto)
        {
            try
            {
                var result = await _userRepository.Registration(dto);

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
        
        
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            try
            {
                var result = await _userRepository.Login(dto);

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
