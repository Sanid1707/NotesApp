// Repository/IUserRepository.cs

using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;

namespace Notes.Repository
{
    public interface IAuthRepository
    {
       
        
        Task<IActionResult> Registration(RegistrationRequest dto);
        IEnumerable<User> GetAllUsers();


        Task<IActionResult> Login(LoginRequest dto);
        Task<IActionResult> ValidateToken(string token);
        Task<IActionResult> VerifyEmail(string token);
    }
}