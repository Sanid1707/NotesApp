// Controllers/UserController.cs
using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;
using Notes.Repository;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest dto)
        {
            try
            {
                var result = await _authRepository.Registration(dto);

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
        
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            try
            {
                var result = await _authRepository.VerifyEmail(token);

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
        
        
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            try
            {
                var result = await _authRepository.Login(dto);

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
        
        
        
        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken()
        {
            // Extract the Authorization header
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Token is missing."
                });
            }

            // Call the repository method
            return await _authRepository.ValidateToken(token);
        }



        }
    }
