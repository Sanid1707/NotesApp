// Repository/IUserRepository.cs
using Notes.Entities;

namespace Notes.Repository
{
    public interface IUserRepository
    {
       
        IEnumerable<User> GetAllUsers();
    }
}