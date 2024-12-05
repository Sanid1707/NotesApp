using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Notes.Repository;

namespace NotesApp.Test.AuthTest
{
	public class AuthRepositoryTest
	{
		private async Task<NotesDbContext> GetDbContext()
		{
			var options = new DbContextOptionsBuilder<NotesDbContext>()
				.UseInMemoryDatabase(databaseName: "NotesApp")
				.Options;

			var context = new NotesDbContext(options);
			context.Database.EnsureCreated();

			if (!await context.Users.AnyAsync())
			{
				context.Users.Add(new Notes.Entities.User
				{
					UserId = Guid.NewGuid(),
					Username = "testuser",
					Email = "test@gmail.com",
					Password = "password",
					Role = 1
				});
				await context.SaveChangesAsync();
			}


			return context;
		}
	}
}
