using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Notes.Common.DTOs;
using Notes.Controllers;
using Notes.Repositories.Interfaces;
using Xunit;

public class UserControllerTests
{
	private readonly Mock<IUserRepository> _userRepositoryMock;
	private readonly UserController _userController;

	public UserControllerTests()
	{
		_userRepositoryMock = new Mock<IUserRepository>();
		_userController = new UserController(_userRepositoryMock.Object);
	}

	[Fact]
	public async Task GetAllUsers_ShouldReturnOk_WhenUsersExist()
	{
		// Arrange
		var users = new List<UserDTO>
		{
			new UserDTO { UserId = Guid.NewGuid(), Username = "John Doe" },
			new UserDTO { UserId = Guid.NewGuid(), Username= "Jane Smith" }
		};
		_userRepositoryMock.Setup(repo => repo.GetAllUsers()).ReturnsAsync(users);

		// Act
		var result = await _userController.GetAllUsers();

		// Assert
		result.Should().BeOfType<OkObjectResult>();
		var okResult = result as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(users);
	}

	[Fact]
	public async Task GetUserById_ShouldReturnOk_WhenUserExists()
	{
		// Arrange
		var userId = Guid.NewGuid();
		var user = new UserDTO { UserId = userId, Username = "John Doe" };
		_userRepositoryMock.Setup(repo => repo.GetUserById(userId)).ReturnsAsync(user);

		// Act
		var result = await _userController.GetUserById(userId);

		// Assert
		result.Should().BeOfType<OkObjectResult>();
		var okResult = result as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(user);
	}

	[Fact]
	public async Task GetUserById_ShouldReturnNotFound_WhenUserDoesNotExist()
	{
		// Arrange
		var userId = Guid.NewGuid();
		_userRepositoryMock.Setup(repo => repo.GetUserById(userId)).ReturnsAsync((UserDTO)null);

		// Act
		var result = await _userController.GetUserById(userId);

		// Assert
		result.Should().BeOfType<NotFoundObjectResult>();
		var notFoundResult = result as NotFoundObjectResult;
		notFoundResult!.Value.Should().BeEquivalentTo(new { success = false, message = "User not found." });
	}

	[Fact]
	public async Task UpdateUser_ShouldReturnOk_WhenUserIsUpdated()
	{
		// Arrange
		var dto = new UpdateUserDTO { UserId = Guid.NewGuid(), Username = "Updated Name" };
		_userRepositoryMock.Setup(repo => repo.UpdateUser(dto)).ReturnsAsync(true);

		// Act
		var result = await _userController.UpdateUser(dto);

		// Assert
		result.Should().BeOfType<OkObjectResult>();
		var okResult = result as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "User updated successfully." });
	}

	[Fact]
	public async Task UpdateUser_ShouldReturnNotFound_WhenUserDoesNotExist()
	{
		// Arrange
		var dto = new UpdateUserDTO {UserId = Guid.NewGuid(), Username = "Updated Name" };
		_userRepositoryMock.Setup(repo => repo.UpdateUser(dto)).ReturnsAsync(false);

		// Act
		var result = await _userController.UpdateUser(dto);

		// Assert
		result.Should().BeOfType<NotFoundObjectResult>();
		var notFoundResult = result as NotFoundObjectResult;
		notFoundResult!.Value.Should().BeEquivalentTo(new { success = false, message = "User not found." });
	}

	[Fact]
	public async Task DeleteUser_ShouldReturnOk_WhenUserIsDeleted()
	{
		// Arrange
		var userId = Guid.NewGuid();
		_userRepositoryMock.Setup(repo => repo.DeleteUser(userId)).ReturnsAsync(true);

		// Act
		var result = await _userController.DeleteUser(userId);

		// Assert
		result.Should().BeOfType<OkObjectResult>();
		var okResult = result as OkObjectResult;
		okResult!.Value.Should().BeEquivalentTo(new { success = true, message = "User deleted successfully." });
	}

	[Fact]
	public async Task DeleteUser_ShouldReturnNotFound_WhenUserDoesNotExist()
	{
		// Arrange
		var userId = Guid.NewGuid();
		_userRepositoryMock.Setup(repo => repo.DeleteUser(userId)).ReturnsAsync(false);

		// Act
		var result = await _userController.DeleteUser(userId);

		// Assert
		result.Should().BeOfType<NotFoundObjectResult>();
		var notFoundResult = result as NotFoundObjectResult;
		notFoundResult!.Value.Should().BeEquivalentTo(new { success = false, message = "User not found." });
	}
}
