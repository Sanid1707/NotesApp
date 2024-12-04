﻿using System;
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

		
		// display all notes method
		Task<IEnumerable<ReadNoteDTO>> GetAllNotes(Guid userId);

		Task<IActionResult> EditNoteTitle(EditNoteTitleDTO dto);
		Task<IActionResult> DeleteNoteTitle(DeleteNoteDTO dto);
		Task<IActionResult> AddNote(EditNoteTitleDTO dto);
	}
}
