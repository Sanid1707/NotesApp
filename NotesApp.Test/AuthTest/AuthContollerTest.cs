using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Notes.Controllers;
using Notes.Repository;
using FakeItEasy;
using Notes.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NotesApp.Test.AuthTest
{
	public class AuthContollerTest
	{
		private readonly IAuthRepository _authRepository;
		private readonly AuthController _authController;

		public AuthContollerTest()
		{
			_authRepository = A.Fake<IAuthRepository>();
			_authController = new AuthController(_authRepository);
		}

		[Fact]
		public async Task Register_WhenCalled_ReturnsOkObjectResult()
		{
			// Arrange
			var dto = A.Fake<RegistrationRequest>();
			A.CallTo(() => _authRepository.Registration(dto))
				.Returns(new OkObjectResult(new { success = true }));

			// Act
			var result = await _authController.Register(dto);

			// Assert
			result.Should().BeOfType<OkObjectResult>();
		}
		[Fact]
		public async Task Register_WhenCalled_ReturnsBadRequestObjectResult()
		{
			// Arrange
			var dto = A.Fake<RegistrationRequest>();
			A.CallTo(() => _authRepository.Registration(dto))
				.Returns(new BadRequestObjectResult(new { success = false }));

			// Act
			var result = await _authController.Register(dto);

			// Assert
			result.Should().BeOfType<BadRequestObjectResult>();
		}

		[Fact]
		public async Task Register_WhenCalled_ReturnsStatusCode500()
		{
			// Arrange
			var dto = A.Fake<RegistrationRequest>();
			A.CallTo(() => _authRepository.Registration(dto))
				.Throws<Exception>();

			// Act
			var result = await _authController.Register(dto);

			// Assert
			result.Should().BeOfType<ObjectResult>()
				.Which.StatusCode.Should().Be(500);
		}

		[Fact]
		public async Task Login_WhenCalledWithValidDto_ReturnsOkObjectResult()
		{
			// Arrange
			var dto = A.Fake<LoginRequest>(); // Mock the LoginRequest
			var expectedResponse = new OkObjectResult(new { success = true, token = "mock-token" });

			// Set up the mock repository to return the expected response
			A.CallTo(() => _authRepository.Login(dto)).Returns(Task.FromResult<IActionResult>(expectedResponse));

			// Act
			var result = await _authController.Login(dto);

			// Assert
			result.Should().BeOfType<OkObjectResult>();

			// Optionally, verify the value inside the OkObjectResult
			var okResult = result as OkObjectResult;
			okResult.Value.Should().BeEquivalentTo(new { success = true, token = "mock-token" });
		}

		[Fact]
		public async Task Login_WhenCalledWithInvalidDto_ReturnsBadRequestObjectResult()
		{
			// Arrange
			var dto = A.Fake<LoginRequest>();
			var expectedResponse = new BadRequestObjectResult(new { success = false, message = "Invalid credentials" });

			A.CallTo(() => _authRepository.Login(dto)).Returns(Task.FromResult<IActionResult>(expectedResponse));

			// Act
			var result = await _authController.Login(dto);

			// Assert
			result.Should().BeOfType<BadRequestObjectResult>();
		}

		[Fact]
		public async Task Login_WhenRepositoryThrowsException_ReturnsInternalServerError()
		{
			// Arrange
			var dto = A.Fake<LoginRequest>();

			A.CallTo(() => _authRepository.Login(dto)).Throws(new Exception("Unexpected error"));

			// Act
			var result = await _authController.Login(dto);

			// Assert
			result.Should().BeOfType<ObjectResult>(); // For 500, it is usually an ObjectResult
			var objectResult = result as ObjectResult;
			objectResult.StatusCode.Should().Be(500);
		}





	}
}
