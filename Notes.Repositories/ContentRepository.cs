using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.Entities;
using Notes.Repositories.Interfaces;
using Notes.Repository;

namespace Notes.Repositories
{
    public class ContentRepository : IContentRepository
    {
        private readonly NotesDbContext _dbContext;

        public ContentRepository(NotesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Content> GetContentByNoteIdAsync(Guid noteId)
        {
            return await _dbContext.Contents
                .Include(c => c.NotesTitle) // Include related NotesTitle if needed
                .FirstOrDefaultAsync(c => c.NoteId == noteId);
        }

        public async Task<Content> UpdateContentAsync(Guid noteId, string formattedContent, string contentType)
        {
            var content = await GetContentByNoteIdAsync(noteId);

            if (content == null)
            {
                // If no content exists, create a new one
                content = new Content
                {
                    NoteId = noteId,
                    FormattedContent = formattedContent,
                    ContentType = contentType,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _dbContext.Contents.AddAsync(content);
            }
            else
            {
                // Update existing content
                content.FormattedContent = formattedContent;
                content.ContentType = contentType;
                content.UpdatedAt = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync();
            return content;
        }
    }
}