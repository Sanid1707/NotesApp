using System;

namespace Notes.Common.DTOs
{
    public class DeleteNoteDTO
    {
        public Guid UserId { get; set; } // ID of the user attempting to delete
        public Guid NoteId { get; set; } // ID of the note to be deleted
    }
}