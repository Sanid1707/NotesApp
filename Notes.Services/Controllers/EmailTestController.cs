using Microsoft.AspNetCore.Mvc;
using Notes.Services.EmailService;
using System;
using System.Threading.Tasks;

namespace Notes.Controllers
{
    [ApiController]
    [Route("api/email-test")]
    public class EmailTestController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailTestController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpGet("send-test")]
        public async Task<IActionResult> SendTestEmail()
        {
            try
            {
                // Call the TestEmailAsync function from SendGridEmailService
                await _emailService.TestEmailAsync();

                // Return success response
                return Ok("Test email sent successfully! Check your inbox.");
            }
            catch (Exception ex)
            {
                // Return error response
                return StatusCode(500, $"Failed to send test email: {ex.Message}");
            }
        }
    }
}