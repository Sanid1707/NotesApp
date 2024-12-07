
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
    public class AuthRepository : IAuthRepository
    {
        private readonly NotesDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthRepository(NotesDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
//testing
        public async Task<IActionResult> Registration(RegistrationRequest dto)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(dto.Username))
                    return new BadRequestObjectResult(new { success = false, message = "Username is required." });

                if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
                    return new BadRequestObjectResult(new { success = false, message = "A valid Email is required." });

                if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                    return new BadRequestObjectResult(new { success = false, message = "Password must be at least 6 characters long." });

                // Check for duplicates
                if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                    return new ConflictObjectResult(new { success = false, message = "The Username is already in use." });

                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                    return new ConflictObjectResult(new { success = false, message = "The Email Address is already in use." });

                // Encrypt password
                var encryptedPassword = CryptoHelper.Encrypt(dto.Password);

                // Create new user
                var newUser = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = dto.Username,
                    Email = dto.Email,
                    Password = encryptedPassword,
                    Role = (byte)UserRole.User,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = 1,
					ProfilePicture = dto.ProfilePicture,

				};

                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { success = true, message = "User registered successfully.", userId = newUser.UserId });
            }
            catch (Exception ex)
            {
                return new ObjectResult(new { success = false, message = $"An error occurred: {ex.Message}" }) { StatusCode = 500 };
            }
        }

        public async Task<IActionResult> Login(LoginRequest dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                    return new BadRequestObjectResult(new { success = false, message = "Email and Password are required." });

                // Check if the user existss
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null)
                    return new NotFoundObjectResult(new { success = false, message = "User not found." });

                // Validate password
                var decryptedPassword = CryptoHelper.Decrypt(user.Password);
                if (decryptedPassword != dto.Password)
                    return new UnauthorizedObjectResult(new { success = false, message = "Invalid credentials." });

                // Generate a new JWT token
                string token = GenerateJwtToken(user);
                user.LatestJwtToken = token;

                // Update user's token in the database
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Login successful.",
                    token,
                    userId = user.UserId,
                    username = user.Username,
                    // email = user.Email,
					// ProfilePicture = user.ProfilePicture,
				});
            }
            catch (Exception ex)
            {
                return new ObjectResult(new { success = false, message = $"An error occurred: {ex.Message}" }) { StatusCode = 500 };
            }
        }

        public async Task<IActionResult> ValidateToken(string token)
        {
            try
            {
                // Decode and validate the token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ValidateLifetime = true // Ensure token is not expired
                }, out SecurityToken validatedToken);

                // Token is valid, verify it matches the latest in the database
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(claim => claim.Type == "sub").Value;

                var user = await _context.Users.FindAsync(Guid.Parse(userId));
                if (user == null || user.LatestJwtToken != token)
                    return new UnauthorizedObjectResult(new { success = false, message = "Token is invalid or not active." });

                return new OkObjectResult(new 
                { success = true, 
                    message = "Token is valid.", 
                    userId = user.UserId,
                    username = user.Username,
					// profilePicture = user.ProfilePicture
				});
            }
            catch (SecurityTokenExpiredException)
            {
                return new UnauthorizedObjectResult(new { success = false, message = "Token has expired." });
            }
            catch (Exception ex)
            {
                return new UnauthorizedObjectResult(new { success = false, message = $"Token is invalid: {ex.Message}" });
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"]);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("Username", user.Username),
                new Claim("Role", user.Role.ToString())
            };

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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