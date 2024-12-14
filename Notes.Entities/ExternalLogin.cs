namespace Notes.Entities;

public class ExternalLogin
{
    public Guid ExternalLoginId { get; set; } 
    public Guid UserId { get; set; } 
    public string Provider { get; set; } 
    public string ProviderKey { get; set; } 
    public DateTime CreatedAt { get; set; } 

    // Navigation Property
    public User User { get; set; }
}