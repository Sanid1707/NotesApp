namespace Notes.Common.DTOs
{
    public class UserDTO
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? ProfilePicture { get; set; } 
    }

    
    public class UpdateUserDTO
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public byte Role { get; set; }
        public string? ProfilePicture { get; set; } 
    }
}