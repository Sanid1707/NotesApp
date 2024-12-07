using System;

namespace Notes.Entities
{
    
    // We are aware that this i a  one to one currently with the Notes table with for future we want this to add in the functionality for images so a Note would have multiple Contents . 
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