﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.Common.DTOs
{
	public class UpdateNoteTitle
	{
		public string Title { get; set; }

		public Guid UserId { get; set; }

		public string tag { get; set; }

		public byte favourite { get; set; }

		public Guid NoteId { get; set; }
	}
}
