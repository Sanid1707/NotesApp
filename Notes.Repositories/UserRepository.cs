// Repository/UserRepository.cs
using Notes.Entities;
using Microsoft.EntityFrameworkCore;

namespace Notes.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly NotesDbContext _context;

        public UserRepository(NotesDbContext context)
        {
            _context = context;
        }

   

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
    }
}