using System;
using System.Collections.Generic;

namespace Notes.Common.DTOs
{
    public class ReadNoteDTO
    {
        public Guid NoteId { get; set; }
        public string Title { get; set; }
        public string Tag { get; set; }
        public byte Favourite { get; set; }
        public DateTime DateCreated { get; set; } 
        public DateTime DateEdited { get; set; } 
        public List<CollaboratorDTO> Collaborators { get; set; }
    }

    public class CollaboratorDTO
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
    }
}