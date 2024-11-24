namespace Notes.Entities
{
    public class User
    {
        public int UserId { get; set; } // Primary Key
        public string Username { get; set; } // Unique Username
        public string Email { get; set; } // Unique Email
        public string PasswordHash { get; set; } // Hashed Password
        public byte Role { get; set; } // Enum for Roles (Admin/User)
        public DateTime CreatedAt { get; set; } // Account Creation Timestamp
        public byte IsActive { get; set; } // Is User Active (Soft Delete)
        public string LatestJwtToken { get; set; } // (Optional) Store the latest JWT token
    }
}