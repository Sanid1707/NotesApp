namespace Notes.Common.DTOs;

public class EditNoteTitleDTO
{
    public Guid UserId { get; set; } // The ID of the user attempting the edit
    public Guid NoteId { get; set; } // The ID of the note to be edited
    public string Title { get; set; } // Updated Title
    public string Tag { get; set; } // Updated Tag
    public NoteFavourite Favourite { get; set; } // Updated Favourite status
}