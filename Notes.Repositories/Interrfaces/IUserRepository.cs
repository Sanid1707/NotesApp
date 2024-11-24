// Repository/IUserRepository.cs

using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;

namespace Notes.Repository
{
    public interface IUserRepository
    {
       
        IEnumerable<User> GetAllUsers();
        Task<IActionResult> Registration(RegistrationRequest dto);
    }
}