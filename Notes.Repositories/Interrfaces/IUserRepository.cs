using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Notes.Common.DTOs;

namespace Notes.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserDTO>> GetAllUsers();
        Task<UserDTO> GetUserById(Guid userId);
        Task<bool> UpdateUser(UpdateUserDTO dto);
        Task<bool> DeleteUser(Guid userId);
        Task<bool> AddMultipleCollaborators(AddMultipleCollaboratorsDTO dto);
        // Task<bool> DeleteMultipleCollaborators(AddMultipleCollaboratorsDTO dto);
        Task<bool> EditCollaborators(AddMultipleCollaboratorsDTO dto);
        Task<bool> DeleteCollaborators(AddMultipleCollaboratorsDTO dto);
    }
}