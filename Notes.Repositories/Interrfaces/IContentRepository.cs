using Notes.DTOs;
using System;
using System.Threading.Tasks;

namespace Notes.Repositories.Interfaces
{
    public interface IContentRepository
    {
        Task<ContentDto> GetContentByNoteIdAsync(Guid noteId);
        Task<ContentDto> UpdateContentAsync(Guid noteId, ContentUpdateDto contentUpdateDto);
    }
}