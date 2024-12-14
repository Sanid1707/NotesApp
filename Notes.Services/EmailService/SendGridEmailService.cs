using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace Notes.Services.EmailService
{
    public class SendGridEmailService : IEmailService
    {
        private readonly string _apiKey;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public SendGridEmailService(IConfiguration configuration)
        {
            var sendGridConfig = configuration.GetSection("SendGridSettings");
            _apiKey = sendGridConfig["ApiKey"] ?? Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            _senderEmail = sendGridConfig["SenderEmail"];
            _senderName = sendGridConfig["SenderName"];
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_senderEmail, _senderName);
            var to = new EmailAddress(toEmail);
            var plainTextContent = "This is the plain text version of the email.";
            var htmlContent = body;

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to send email. Status: {response.StatusCode}");
            }

            Console.WriteLine($"Test email sent successfully to {toEmail}");
        }

        // New function for testing
        public async Task TestEmailAsync()
        {
            var testRecipient = "pandeysanid@gmail.com"; // Replace with your test email
            var subject = "SendGrid Email Test";
            var body = "<h1>Test Email</h1><p>This is a test email sent using SendGrid API.</p>";

            await SendEmailAsync(testRecipient, subject, body);
        }
    }
}