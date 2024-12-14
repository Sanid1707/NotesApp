namespace Notes.Services.EmailService;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
    Task TestEmailAsync();
}