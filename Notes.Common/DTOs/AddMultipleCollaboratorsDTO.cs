namespace Notes.Common.DTOs;

public class AddMultipleCollaboratorsDTO
{
    public Guid NoteId { get; set; } // The ID of the note
    public List<CollaboratorDTO> Collaborators { get; set; } // List of collaborators

    public class CollaboratorDTO
    {
        public Guid UserId { get; set; } // User ID of the collaborator
        public NoteRoles? Role { get; set; } // Role (Owner, Editor, Viewer)
        public NoteStatus? Status { get; set; } = NoteStatus.Active; // Status (Active, Archived)
    }
}