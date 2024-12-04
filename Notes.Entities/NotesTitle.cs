using System;
using System.Collections.Generic;

namespace Notes.Entities
{
    public class NotesTitle
    {
        public Guid NoteId { get; set; } // Primary Key
        public string Title { get; set; } // Unique Title
        public DateTime DateCreated { get; set; } // Creation Date
        public DateTime DateEdited { get; set; } // Edit Date
        public string Tag { get; set; } // Tag for categorization
        public byte IsActive { get; set; } // Is Note Active (Soft Delete)
        public byte Favourite { get; set; } // Is Note Marked as Favourite

        public Content Content { get; set; } // One-to-One relationship with Content
        public ICollection<UserNotes> UserNotes { get; set; } // Many-to-Many relationship with Users
    }
}