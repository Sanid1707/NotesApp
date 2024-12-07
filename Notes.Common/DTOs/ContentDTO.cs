using System;

namespace Notes.DTOs
{
    public class ContentDto
    {
        public Guid NoteId { get; set; }
        public string FormattedContent { get; set; }
        public string ContentType { get; set; }
        public DateTime UpdatedAt { get; set; } // To show last updated timestamp
        public string NoteTitle { get; set; } // Title of the note
        public string? Tag { get; set; } 
    }

    public class ContentUpdateDto
    {
        public string FormattedContent { get; set; } // New content to save
        public string ContentType { get; set; } // Type of the content (e.g., HTML)
    }
}