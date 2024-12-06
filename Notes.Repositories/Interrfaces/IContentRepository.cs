using System;
using System.Threading.Tasks;
using Notes.Entities;

namespace Notes.Repositories.Interfaces
{
    public interface IContentRepository
    {
        Task<Content> GetContentByNoteIdAsync(Guid noteId); // Fetch content by noteId
        Task<Content> UpdateContentAsync(Guid noteId, string formattedContent, string contentType); // Update content
    }
}