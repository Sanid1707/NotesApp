using Microsoft.EntityFrameworkCore;
using Notes.Entities;

namespace Notes.Repository
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<NotesTitle> NotesTitles { get; set; }
        public DbSet<Content> Contents { get; set; }
        public DbSet<UserNotes> UserNotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Password).IsRequired();
                entity.Property(u => u.Role).IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(u => u.IsActive).IsRequired().HasDefaultValue((byte)1);
                entity.Property(u => u.ProfilePicture).IsRequired(false);
            });

            // NotesTitle entity configuration
            modelBuilder.Entity<NotesTitle>(entity =>
            {
                entity.HasKey(n => n.NoteId);
                entity.Property(n => n.Title).IsRequired().HasMaxLength(100);
                entity.Property(n => n.DateCreated).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(n => n.DateEdited).IsRequired();
                entity.Property(n => n.Tag).HasMaxLength(50);
                entity.Property(n => n.IsActive).IsRequired().HasDefaultValue((byte)1);
                entity.Property(n => n.Favourite).IsRequired().HasDefaultValue((byte)0);
            });

            // Content entity configuration
            modelBuilder.Entity<Content>(entity =>
            {
                entity.HasKey(c => c.NoteId);
                entity.Property(c => c.FormattedContent).IsRequired();
                entity.Property(c => c.ContentType).IsRequired().HasMaxLength(20);
                entity.Property(c => c.CreatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.Property(c => c.UpdatedAt).IsRequired().HasDefaultValueSql("GETDATE()");
                entity.HasOne(c => c.NotesTitle)
                    .WithOne(n => n.Content)
                    .HasForeignKey<Content>(c => c.NoteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // UserNotes entity configuration
            modelBuilder.Entity<UserNotes>(entity =>
            {
                entity.HasKey(un => new { un.UserId, un.NoteId });
                entity.HasOne(un => un.User)
                    .WithMany(u => u.UserNotes)
                    .HasForeignKey(un => un.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(un => un.NotesTitle)
                    .WithMany(n => n.UserNotes)
                    .HasForeignKey(un => un.NoteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}