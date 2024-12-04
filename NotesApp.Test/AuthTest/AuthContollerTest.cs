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
		public void Register_WhenCalled_ReturnsOkObjectResult()
		{
			// Arrange
			var dto = new RegistrationRequest();
			A.CallTo(() => _authRepository.Registration(dto)).Returns(new OkObjectResult(new { success = true }));

			// Act
			var result = _authController.Register(dto);

			// Assert
			Assert.IsType<OkObjectResult>(result);
		}


	}
}
