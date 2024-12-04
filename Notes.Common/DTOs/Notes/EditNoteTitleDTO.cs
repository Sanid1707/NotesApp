namespace Notes.Common.DTOs;

public class EditNoteTitleDTO
{
    public Guid UserId { get; set; } 
    public Guid? NoteId { get; set; } 
    public string Title { get; set; } 
    public string Tag { get; set; } 
    public NoteFavourite Favourite { get; set; } 
    public NoteStatus? Status { get; set; }
}