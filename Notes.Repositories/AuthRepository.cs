
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
using Notes.Common.Templates;
using Notes.Common.Utils;
using Notes.Entities;
using Notes.Services.EmailService;

namespace Notes.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly NotesDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService; 

        public AuthRepository(NotesDbContext context, IConfiguration configuration,IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;

        }
//testing


        public async Task<IActionResult> Registration(RegistrationRequest dto)
        {
            try
            {
                // 1. Input validation
                // if (string.IsNullOrWhiteSpace(dto.Username))
                //     return new BadRequestObjectResult(new { success = false, message = "Username is required." });
                //
                // if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
                //     return new BadRequestObjectResult(new { success = false, message = "A valid Email is required." });
                //
                // if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                //     return new BadRequestObjectResult(new { success = false, message = "Password must be at least 6 characters long." });
                //
                // // 2. Check for duplicate user
                // if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                //     return new ConflictObjectResult(new { success = false, message = "The Username is already in use." });
                //
                // if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                //     return new ConflictObjectResult(new { success = false, message = "The Email Address is already in use." });

                // 3. Encrypt the password using CryptoHelper
                var encryptedPassword = CryptoHelper.Encrypt(dto.Password);

                // 4. Generate verification token
                var verificationToken = Guid.NewGuid().ToString();

                // 5. Create a new user
                var newUser = new User
                {
                    UserId = Guid.NewGuid(),
                    Username = dto.Username,
                    Email = dto.Email,
                    Password = encryptedPassword,
                    Role = (byte)UserRole.User,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = 1,
                    EmailConfirmed = 0, // Email is not yet verified
                    EmailVerificationToken = verificationToken,
                    TokenExpiration = DateTime.UtcNow.AddHours(24), // Token valid for 24 hours
                    ProfilePicture = dto.ProfilePicture
                };

                // 6. Save user to the database
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();

    
                // 7. Generate email verification link
                var verificationLink = $"{_configuration["AppSettings:BaseUrl"]}/api/auth/verify-email?token={verificationToken}";

                // 8. Get email body from the static template
                var subject = "Verify Your Email Address";
                var body = EmailTemplates.GetEmailVerificationBody(dto.Username, verificationLink);

                // 9. Send verification email using IEmailService
                await _emailService.SendEmailAsync(dto.Email, subject, body);

                // 9. Return success response
                return new OkObjectResult(new
                {
                    success = true,
                    message = "Registration successful! Please check your email to verify your account.",
                    userId = newUser.UserId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.InnerException?.Message ?? ex.Message}");
                return new ObjectResult(new
                {
                    success = false,
                    message = $"An error occurred during registration: {ex.InnerException?.Message ?? ex.Message}"
                }) { StatusCode = 500 };
            }
        }


        public async Task<IActionResult> VerifyEmail(string token)
        {
            try
            {
                // 1. Validate token input
                if (string.IsNullOrEmpty(token))
                    return new BadRequestObjectResult(new { success = false, message = "Token is required." });

                // 2. Find user with matching token
                var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

                if (user == null)
                    return new NotFoundObjectResult(new { success = false, message = "Invalid or expired token." });

                // 3. Check if token is expired
                if (user.TokenExpiration < DateTime.UtcNow)
                    return new BadRequestObjectResult(new { success = false, message = "Token has expired. Please register again." });

                // 4. Mark email as confirmed
                user.EmailConfirmed = 1;
                user.EmailVerificationToken = null; // Clear the token
                user.TokenExpiration = null; // Clear expiration date

                // 5. Update the user in the database
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Email verified successfully. You can now log in."
                });
            }
            catch (Exception ex)
            {
                return new ObjectResult(new
                {
                    success = false,
                    message = $"An error occurred while verifying the email: {ex.Message}"
                }) { StatusCode = 500 };
            }
        }


    //     public async Task<IActionResult> Registration(RegistrationRequest dto)
    //     {
    //         try
    //         {
    //             // Input validation
    //             if (string.IsNullOrWhiteSpace(dto.Username))
    //                 return new BadRequestObjectResult(new { success = false, message = "Username is required." });
    //
    //             if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
    //                 return new BadRequestObjectResult(new { success = false, message = "A valid Email is required." });
    //
    //             if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
    //                 return new BadRequestObjectResult(new { success = false, message = "Password must be at least 6 characters long." });
    //
    //             // Check for duplicates
    //             if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
    //                 return new ConflictObjectResult(new { success = false, message = "The Username is already in use." });
    //
    //             if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
    //                 return new ConflictObjectResult(new { success = false, message = "The Email Address is already in use." });
    //
    //             // Encrypt password
    //             var encryptedPassword = CryptoHelper.Encrypt(dto.Password);
    //
    //             // Create new user
    //             var newUser = new User
    //             {
    //                 UserId = Guid.NewGuid(),
    //                 Username = dto.Username,
    //                 Email = dto.Email,
    //                 Password = encryptedPassword,
    //                 Role = (byte)UserRole.User,
    //                 CreatedAt = DateTime.UtcNow,
    //                 IsActive = 1,
				// 	ProfilePicture = dto.ProfilePicture,
    //
				// };
    //
    //             await _context.Users.AddAsync(newUser);
    //             await _context.SaveChangesAsync();
    //
    //             return new OkObjectResult(new { success = true, message = "User registered successfully.", userId = newUser.UserId });
    //         }
    //         catch (Exception ex)
    //         {
    //             return new ObjectResult(new { success = false, message = $"An error occurred: {ex.Message}" }) { StatusCode = 500 };
    //         }
    //     }

        
        
        
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
        
        
        // The method validates email addresses by leveraging the MailAddress class
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