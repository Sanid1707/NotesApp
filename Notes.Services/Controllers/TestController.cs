using Microsoft.AspNetCore.Mvc;
using Notes.Entities;
using Notes.Repository;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public TestController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        // GET: api/test/users
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _authRepository.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}