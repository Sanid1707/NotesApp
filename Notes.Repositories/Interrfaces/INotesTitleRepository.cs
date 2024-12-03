using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Notes.Common.DTOs;
using Notes.Entities;

namespace Notes.Repositories.Interrfaces
{
	public  interface INotesTitleRepository
	{
		// add note method
		Task<IActionResult> AddNotes(CreateNoteTitle dto);
		// delete note method
		Task<IActionResult> DeleteNotes(Guid noteId);

		// display all notes method
		// Task<IEnumerable<NotesTitle>> GetAllNotes(Guid userId);

		// update note method
		Task<IActionResult> UpdateNotes(UpdateNoteTitle dto);


	}
}
