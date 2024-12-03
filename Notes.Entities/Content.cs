using System;

namespace Notes.Entities
{
    public class Content
    {
        public Guid NoteId { get; set; } // Primary Key and Foreign Key (One-to-One relationship with NotesTitle)
        public string FormattedContent { get; set; } // Formatted Content (e.g., HTML/JSON)
        public string ContentType { get; set; } // Type of Content (e.g., HTML, JSON)
        public DateTime CreatedAt { get; set; } // Creation Timestamp
        public DateTime UpdatedAt { get; set; } // Update Timestamp

        public NotesTitle NotesTitle { get; set; } // Navigation Property
    }
}