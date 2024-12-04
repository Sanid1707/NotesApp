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
		
		// display all notes method
		Task<IEnumerable<ReadNoteDTO>> GetAllNotes(Guid userId);

		Task<IActionResult> EditNoteTitle(EditNoteTitleDTO dto);
		Task<IActionResult> DeleteNoteTitle(DeleteNoteDTO dto);
	}
}
