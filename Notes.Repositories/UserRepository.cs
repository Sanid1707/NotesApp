using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notes.Common.DTOs;
using Notes.Common.Enums;
using Notes.Common.Utils;
using Notes.Entities;

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
              
                // Check for duplicate Email
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return new ConflictObjectResult(new
                    {
                        success = false,
                        message = "The Email Address is already in use."
                    });
                }

                // Encrypt password only
                var encryptedPassword = CryptoHelper.Encrypt(dto.Password);

                // Create a new User object
                var newUser = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = dto.Username, // Save as plaintext
                    Email = dto.Email,       // Save as plaintext
                    Password = encryptedPassword, // Encrypted password
                    Role = (byte)UserRole.User,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = 1 // Active by default
                };

                // Add the new user to the database
                await _context.Users.AddAsync(newUser);
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
                // Handle unexpected exceptions
                return new ObjectResult(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
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
        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
    }
}