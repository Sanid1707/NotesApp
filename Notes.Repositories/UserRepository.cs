using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.Common.DTOs;
using Notes.Entities;
using Notes.Repositories.Interfaces;
using Notes.Repository;

namespace Notes.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly NotesDbContext _context;

        public UserRepository(NotesDbContext context)
        {
            _context = context;
        }

        
        // Get All the Users to be displayed for choosing a Collaborator 
        public async Task<IEnumerable<UserDTO>> GetAllUsers()
        {
            try
            {
                // Fetching all users and project to UserDTO
                return await _context.Users
                    .Select(u => new UserDTO
                    {
                        UserId = u.UserId,
                        Username = u.Username,
                        Email = u.Email,
                        ProfilePicture = u.ProfilePicture
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return new List<UserDTO>();
            }
        }

        
    }
}