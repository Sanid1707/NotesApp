using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Notes.Controllers;
using Notes.Repositories;
using FakeItEasy;
using Notes.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using FluentAssertions;
using Notes.Repositories;
using Microsoft.Identity.Client;
using Notes.Repositories.Interrfaces;

namespace NotesApp.Test.NotetitleTest
{
	public class NoteTitleControllerTest
	{
		private readonly INotesTitleRepository _noteTitleRepository;
		private readonly NotesTitleController _noteTitleController;

		public NoteTitleControllerTest()
		{
			_noteTitleRepository = A.Fake<NotesTitleRepository>();
			_noteTitleController = new NotesTitleController(_noteTitleRepository);
		}

		//[Fact]
		//public async Task GetAllNotesTitle_WhenCalled_ReturnsOkObjectResult()
		//{
		//	// Arrange
		//	var guid =A.Fake<String>();
		//	A.CallTo(() => _noteTitleRepository.GetAllActiveNotes(guid))
		//		.Returns(new OkObjectResult(new { success = true }));

		//	// Act
		//	var result = await _noteTitleController.GetAllNotesTitle(guid);

		//	// Assert
		//	result.Should().BeOfType<OkObjectResult>();
		//}

		[Fact]
		public async Task GetAllNotesTitle_WithValidUserId_ReturnsOkObjectResultWithNotes()
		{
			// Arrange
			var userId = Guid.NewGuid(); // Mock a valid user ID
			var mockNotes = new List<ReadNoteDTO> // Example mock data
			{
				new ReadNoteDTO { NoteId = Guid.NewGuid(), Title = "Note 1" },
				new ReadNoteDTO { NoteId = Guid.NewGuid(), Title = "Note 2" }
			};

			A.CallTo(() => _noteTitleRepository.GetAllActiveNotes(userId))
				.Returns(Task.FromResult(mockNotes.AsEnumerable()));

			// Act
			var result = await _noteTitleController.GetAllNotesTitle(userId);

			// Assert
			result.Should().BeOfType<OkObjectResult>();

			// Extract the result and verify its value
			var okResult = result as OkObjectResult;
			okResult.Value.Should().BeEquivalentTo(mockNotes);
		}


		[Fact]
		public async Task GetAllNotesTitle_WithInvalidUserId_ReturnsNotFoundObjectResult()
		{
			// Arrange
			var userId = Guid.Empty; // Mock an invalid user ID
			A.CallTo(() => _noteTitleRepository.GetAllActiveNotes(userId)).Returns(Task.FromResult<IEnumerable<ReadNoteDTO>>(null));

			// Act
			var result = await _noteTitleController.GetAllNotesTitle(userId);

			// Assert
			result.Should().BeOfType<NotFoundObjectResult>();
		}


	}
}
