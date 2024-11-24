// Repository/UserRepository.cs

using Microsoft.AspNetCore.Mvc;
using Notes.Entities;
using Microsoft.EntityFrameworkCore;
using Notes.Common.DTOs;
using Notes.Common.Enums;

namespace Notes.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly NotesDbContext _context;

        public UserRepository(NotesDbContext context)
        {
            _context = context;
          
        
        } 
         public async Task<IActionResult> Registration(RegistrationRequest dto)
            {
                try
                {
                    // Input validation
                    if (string.IsNullOrWhiteSpace(dto.Username))
                    {
                        return new BadRequestObjectResult(new
                        {
                            success = false,
                            message = "Username is required."
                        });
                    }

                    if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
                    {
                        return new BadRequestObjectResult(new
                        {
                            success = false,
                            message = "A valid Email is required."
                        });
                    }

                    if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                    {
                        return new BadRequestObjectResult(new
                        {
                            success = false,
                            message = "Password is required and must be at least 6 characters long."
                        });
                    }

                    // Check for duplicate Username
                    var usernameExists = await _context.Users
                        .AnyAsync(u => u.Username == dto.Username);

                    if (usernameExists)
                    {
                        return new ConflictObjectResult(new
                        {
                            success = false,
                            message = "The Username is already in use."
                        });
                    }

                    // Check for duplicate Email
                    var emailExists = await _context.Users
                        .AnyAsync(u => u.Email == dto.Email);

                    if (emailExists)
                    {
                        return new ConflictObjectResult(new
                        {
                            success = false,
                            message = "The Email Address is already in use."
                        });
                    }

                    // Hash the password
                    var hashedPassword = HashPassword(dto.Password);

                    // Create a new User object
                    var newUser = new User
                    {
                        UserId = Guid.NewGuid(), // Assign a new GUID for the user ID
                        Username = dto.Username,
                        Email = dto.Email,
                        Password = hashedPassword,
                        Role = (byte)UserRole.User, // Assuming Role is coming from the DTO
                        CreatedAt = DateTime.UtcNow,
                        IsActive = 1
                    };

                    // Add the user to the database
                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();

                    return new OkObjectResult(new
                    {
                        success = true,
                        message = "User registered successfully.",
                        userId = newUser.UserId
                    });
                }
                catch (Exception ex)
                {
                    return new ObjectResult(new
                    {
                        success = false,
                        message = ex.Message
                    })
                    { StatusCode = 500 };
                }
            }

            private bool IsValidEmail(string email)
            {
                try
                {
                    var addr = new System.Net.Mail.MailAddress(email);
                    return addr.Address == email;
                }
                catch
                {
                    return false;
                }
            }

            // Helper method to hash passwords
            private string HashPassword(string password)
            {
                // Use a secure hashing algorithm, such as SHA256 or bcrypt
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                    return Convert.ToBase64String(hashedBytes);
                }
            }

               

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
    }
}