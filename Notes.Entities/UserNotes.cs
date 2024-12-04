using System;

namespace Notes.Entities
{
    public class UserNotes
    {
        public Guid UserId { get; set; } // Foreign Key to User
        public Guid NoteId { get; set; } // Foreign Key to NotesTitle
        public NoteRoles Role { get; set; }
        public NoteStatus Status { get; set; } // Enum for Note Status (Active, Archive)
        public DateTime AccessGrantedAt { get; set; } // Timestamp when the user was added as a collaborator

        public User User { get; set; } // Navigation Property
        public NotesTitle NotesTitle { get; set; } // Navigation Property
    }
}