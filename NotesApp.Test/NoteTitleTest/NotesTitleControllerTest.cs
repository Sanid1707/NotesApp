using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Notes.Common.DTOs;
using Notes.Controllers;
using Notes.Repositories.Interrfaces;
using Xunit;

public class NotesTitleControllerTests
{
	private readonly Mock<INotesTitleRepository> _notesTitleRepositoryMock;
	private readonly NotesTitleController _notesTitleController;

	public NotesTitleControllerTests()
	{
		_notesTitleRepositoryMock = new Mock<INotesTitleRepository>();
		_notesTitleController = new NotesTitleController(_notesTitleRepositoryMock.Object);
	}

	[Fact]
	public async Task GetAllNotesTitle_ShouldReturnOk_WhenNotesExist()
	{
		// Arrange
		var userId = Guid.NewGuid();
		var notes = new List<ReadNoteDTO>
		{
			new ReadNoteDTO{ NoteId = Guid.NewGuid(), Title = "Note 1", Favourite = 1},
			new ReadNoteDTO { NoteId= Guid.NewGuid(), Title = "Note 2", Favourite = 0 }
		};
		_notesTitleRepositoryMock.Setup(repo => repo.GetAllActiveNotes(userId)).ReturnsAsync(notes);

		// Act
		var result = await _notesTitleController.GetAllNotesTitle(userId);

		// Assert
		result.Should().BeOfType<OkObjectResult>();
		var okResult = result as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(notes);
	}

	[Fact]
	public async Task AddNote_ShouldReturnActionResult_WhenNoteIsAdded()
	{
		// Arrange
		var dto = new EditNoteTitleDTO { Title = "New Note", UserId = Guid.NewGuid() };
		var result = new OkObjectResult(new { success = true, message = "Note added successfully." });
		_notesTitleRepositoryMock.Setup(repo => repo.AddNote(dto)).ReturnsAsync(result);

		// Act
		var actionResult = await _notesTitleController.AddNote(dto);

		// Assert
		actionResult.Should().BeOfType<OkObjectResult>();
		var okResult = actionResult as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "Note added successfully." });
	}

	[Fact]
	public async Task EditNoteTitle_ShouldReturnActionResult_WhenNoteIsEdited()
	{
		// Arrange
		var dto = new EditNoteTitleDTO { NoteId = Guid.NewGuid(), Title = "Updated Note", UserId = Guid.NewGuid() };
		var result = new OkObjectResult(new { success = true, message = "Note updated successfully." });
		_notesTitleRepositoryMock.Setup(repo => repo.EditNoteTitle(dto)).ReturnsAsync(result);

		// Act
		var actionResult = await _notesTitleController.EditNoteTitle(dto);

		// Assert
		actionResult.Should().BeOfType<OkObjectResult>();
		var okResult = actionResult as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "Note updated successfully." });
	}

	[Fact]
	public async Task ToggleFavourite_ShouldReturnActionResult_WhenFavouriteToggled()
	{
		// Arrange
		var noteId = Guid.NewGuid();
		var dto = new ToggleFavouriteDTO { UserId = Guid.NewGuid() };
		var result = new OkObjectResult(new { success = true, message = "Favourite status toggled successfully." });
		_notesTitleRepositoryMock.Setup(repo => repo.ToggleFavourite(noteId, dto.UserId)).ReturnsAsync(result);

		// Act
		var actionResult = await _notesTitleController.ToggleFavourite(noteId, dto);

		// Assert
		actionResult.Should().BeOfType<OkObjectResult>();
		var okResult = actionResult as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "Favourite status toggled successfully." });
	}

	[Fact]
	public async Task DeleteNoteTitle_ShouldReturnActionResult_WhenNoteIsDeleted()
	{
		// Arrange
		var dto = new DeleteNoteDTO { NoteId = Guid.NewGuid(), UserId = Guid.NewGuid() };
		var result = new OkObjectResult(new { success = true, message = "Note deleted successfully." });
		_notesTitleRepositoryMock.Setup(repo => repo.DeleteNoteTitle(dto)).ReturnsAsync(result);

		// Act
		var actionResult = await _notesTitleController.DeleteNoteTitle(dto);

		// Assert
		actionResult.Should().BeOfType<OkObjectResult>();
		var okResult = actionResult as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "Note deleted successfully." });
	}

	
}
