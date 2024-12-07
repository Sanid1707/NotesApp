using Microsoft.EntityFrameworkCore;
using Notes.Common.Utils;
using Notes.Repositories;
using Notes.Repositories.Interfaces;
using Notes.Repositories.Interrfaces;
using Notes.Repository;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options =>
{
	options.ListenAnyIP(5189); // HTTP
	options.ListenAnyIP(7274, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<NotesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add scoped services
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<INotesTitleRepository, NotesTitleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IContentRepository, ContentRepository>();
CryptoHelper.Initialize(builder.Configuration);
builder.Services.AddCors(options =>
{
	builder.Services.AddCors(options =>
	{
		options.AddPolicy("AllowAll", builder =>
		{
			builder.AllowAnyOrigin()
				   .AllowAnyMethod()
				   .AllowAnyHeader();
		});
	});
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}





// Use CORS
app.UseCors("AllowAll");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();