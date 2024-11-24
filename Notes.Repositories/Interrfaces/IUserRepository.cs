// Repository/IUserRepository.cs

using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;

namespace Notes.Repository
{
    public interface IUserRepository
    {
       
        
        Task<IActionResult> Registration(RegistrationRequest dto);
        IEnumerable<User> GetAllUsers();


        Task<IActionResult> Login(LoginRequest dto);
    }
}