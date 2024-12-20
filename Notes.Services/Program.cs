using Microsoft.EntityFrameworkCore;
using Notes.Common.Utils;
using Notes.Repositories;
using Notes.Repositories.Interfaces;
using Notes.Repositories.Interrfaces;
using Notes.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
try{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"Attempting to connect to database: {connectionString}");

    builder.Services.AddDbContext<NotesDbContext>(options =>
        options.UseSqlServer(connectionString));
}
catch (Exception ex)
{
    Console.WriteLine($"Error initializing database connection: {ex.Message}");
}

// Add scoped services
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<INotesTitleRepository, NotesTitleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IContentRepository, ContentRepository>();
CryptoHelper.Initialize(builder.Configuration);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000") 
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowFrontend");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
