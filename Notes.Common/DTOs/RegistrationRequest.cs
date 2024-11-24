namespace Notes.Common.DTOs;

public class RegistrationRequest
{
    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string OrganisationCode { get; set; } // New field for OrganisationCode
   
}