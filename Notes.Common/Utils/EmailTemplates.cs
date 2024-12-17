namespace Notes.Common.Templates
{
    public static class EmailTemplates
    {
        public static string GetEmailVerificationBody(string username, string verificationLink)
        {
            return $@"
                <h1>Welcome to NotesApp, {username}!</h1>
                <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
                <p><a href='{verificationLink}'>Verify Email</a></p>
                <p>This link will expire in 24 hours.</p>";
        }

        public static string GetPasswordResetBody(string username, string resetLink)
        {
            return $@"
                <h1>Password Reset Request</h1>
                <p>Hello {username},</p>
                <p>You requested to reset your password. Please click the link below to reset it:</p>
                <p><a href='{resetLink}'>Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>";
        }
    }
}