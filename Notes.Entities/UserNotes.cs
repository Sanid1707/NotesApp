using System;

namespace Notes.Entities
{
    public class UserNotes
    {
        public Guid UserId { get; set; } // Foreign Key to User
        public Guid NoteId { get; set; } // Foreign Key to NotesTitle
        public string Role { get; set; } // Role in the Note (e.g., Owner, Editor, Viewer)
        public DateTime AccessGrantedAt { get; set; } // Timestamp when the user was added as a collaborator

        public User User { get; set; } // Navigation Property
        public NotesTitle NotesTitle { get; set; } // Navigation Property
    }
}