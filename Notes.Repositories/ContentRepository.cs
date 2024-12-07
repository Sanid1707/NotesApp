using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.DTOs;
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

        // Fetch content by NoteId
        public async Task<ContentDto> GetContentByNoteIdAsync(Guid noteId)
        {
            try
            {
                // Fetch the content and include the related NotesTitle entity
                var content = await _dbContext.Content
                    .Include(c => c.NotesTitle) // Include the related NotesTitle entity
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.NoteId == noteId);

                if (content == null)
                {
                    Console.WriteLine($"Content not found for NoteId: {noteId}");
                    return null; // Return null if no content is found
                }

                // Map the content and note title to the DTO
                return new ContentDto
                {
                    NoteId = content.NoteId,
                    FormattedContent = content.FormattedContent,
                    ContentType = content.ContentType,
                    UpdatedAt = content.UpdatedAt,
                    NoteTitle = content.NotesTitle?.Title, 
                    Tag = content.NotesTitle?.Tag
                };
            }
            catch (DbUpdateException dbEx)
            {
                // Log database update exception
                Console.WriteLine($"Database error occurred while fetching content: {dbEx.Message}");
                throw new Exception("A database error occurred while fetching the content.", dbEx);
            }
            catch (Exception ex)
            {
                // Log general exceptions
                Console.WriteLine($"An unexpected error occurred: {ex.Message}");
                throw new Exception("An unexpected error occurred while fetching the content.", ex);
            }
        }

        // Update or create content
        public async Task<ContentDto> UpdateContentAsync(Guid noteId, ContentUpdateDto contentUpdateDto)
        {
            try
            {
                // Fetch the content based on the NoteId
                var content = await _dbContext.Content.FirstOrDefaultAsync(c => c.NoteId == noteId);

                if (content == null)
                {
                    // Throw an exception or return null for non-existent content
                    throw new Exception($"Content with NoteId {noteId} does not exist.");
                }
        
                // Update existing content
                content.FormattedContent = contentUpdateDto.FormattedContent;
                content.ContentType = contentUpdateDto.ContentType;
                content.UpdatedAt = DateTime.UtcNow;

                // Save changes to the database
                await _dbContext.SaveChangesAsync();

                // Return the updated content as DTO
                return new ContentDto
                {
                    NoteId = content.NoteId,
                    FormattedContent = content.FormattedContent,
                    ContentType = content.ContentType,
                    UpdatedAt = content.UpdatedAt
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating content: {ex.Message}");
                throw new Exception("Failed to update content. " + ex.Message);
            }
        }
    }
}