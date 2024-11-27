using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notes.Entities
{
	public class NotesTitle
	{
		public Guid UserId { get; set; } // Forign Key
		public Guid NoteId { get; set; } // Primary Key
		public string Title { get; set; } // Unique Username
		public DateTime DateCreated { get; set; } // Creation Date
		public DateTime DataEditied { get; set; } // Edit Date
		public string Tag { get; set; } // Enum for Roles (Admin/User)
		public byte IsActive { get; set; } // Is User Active (Soft Delete)
		public byte favourite { get; set; } // favourite

		public User User { get; set; } // Navigation Property

	}
}
