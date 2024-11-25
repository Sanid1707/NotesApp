using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Notes.Common.DTOs;
using Notes.Common.Enums;
using Notes.Common.Utils;
using Notes.Entities;

namespace Notes.Repository
{
    public class UserRepository : IUserRepository
    
    {
        private readonly NotesDbContext _context;
        private readonly IConfiguration _configuration;

        public UserRepository(NotesDbContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                        message = "Password must be at least 6 characters long."
                    });
                }

                // Check for duplicate Username
                if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                {
                    return new ConflictObjectResult(new
                    {
                        success = false,
                        message = "The Username is already in use."
                    });
                }

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
        
        
        
public async Task<IActionResult> Login(LoginRequest dto)
{
    try
    {
        // Step 1: Validate input
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "Email and Password are required."
            });
        }

        // Step 2: Check if the user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
        {
            return new NotFoundObjectResult(new
            {
                success = false,
                message = "User not found."
            });
        }

        // Step 3: Decrypt and validate the password
        var decryptedPassword = CryptoHelper.Decrypt(user.Password);
        if (decryptedPassword != dto.Password)
        {
            return new UnauthorizedObjectResult(new
            {
                success = false,
                message = "Invalid credentials."
            });
        }

        // Step 4: Generate a new JWT token if not already present
        string token;
        if (string.IsNullOrEmpty(user.LatestJwtToken))
        {
            token = GenerateJwtToken(user);
            user.LatestJwtToken = token;

            // Update the user's JWT token in the database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            token = user.LatestJwtToken;
        }

        // Step 5: Return success response with JWT token
        return new OkObjectResult(new
        {
            success = true,
            message = "Login successful.",
            token = token,
            userId = user.UserId,
            username = user.Username,
            email = user.Email
        });
    }
    catch (Exception ex)
    {
        // Step 6: Handle unexpected exceptions
        return new ObjectResult(new
        {
            success = false,
            message = $"An error occurred: {ex.Message}"
        })
        { StatusCode = 500 };
    }
}

private string GenerateJwtToken(User user)
{
    // Get JWT settings from configuration
    var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
    var issuer = _configuration["Jwt:Issuer"];
    var audience = _configuration["Jwt:Audience"];
    var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"]);

    // Create claims
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("Username", user.Username),
        new Claim("Role", user.Role.ToString())
    };

    // Create signing credentials
    var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

    // Create JWT token
    var token = new JwtSecurityToken(
        issuer,
        audience,
        claims,
        expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
        signingCredentials: credentials
    );

    // Return the serialized token
    return new JwtSecurityTokenHandler().WriteToken(token);
}

    }
}