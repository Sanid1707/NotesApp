using System;
using System.Collections.Generic;

namespace Notes.Entities
{
    public class User
    {
        // Primary Key
        public Guid UserId { get; set; }

        // Basic Information
        public string Username { get; set; } // Unique Username
        public string Email { get; set; } // Unique Email
        public string Password { get; set; } // Hashed Password

        // Account Status
        public byte Role { get; set; } // 1 = User, 0 = Admin
        public DateTime CreatedAt { get; set; } // Account Creation Timestamp
        public byte IsActive { get; set; } // 1 = Active, 0 = Inactive

        // JWT Management
        public string? LatestJwtToken { get; set; }
        public DateTime? JwtTokenIssuedAt { get; set; }

        // Profile Information
        public string? ProfilePicture { get; set; }

        // Email Verification
        public byte EmailConfirmed { get; set; } 
        public string? EmailVerificationToken { get; set; } 
        public DateTime? TokenExpiration { get; set; } 

        // Two-Factor Authentication (2FA)
        public byte TwoFactorEnabled { get; set; } 
        public string? LatestOtp { get; set; }
        public DateTime? OtpExpiration { get; set; }

        // Navigation Properties
        public ICollection<UserNotes> UserNotes { get; set; }
        public ICollection<ExternalLogin> ExternalLogins { get; set; }
    }
}