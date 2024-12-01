//using Microsoft.EntityFrameworkCore;
//using Notes.Entities;

//namespace Notes.Repository
//{
//    public class NotesDbContext : DbContext
//    {
//        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options) { }

//        public DbSet<User> Users { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            modelBuilder.Entity<User>(entity =>
//            {
//                entity.HasKey(u => u.UserId); // Primary Key

//                entity.Property(u => u.UserId)
//                    .IsRequired(); 

//                entity.Property(u => u.Username)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.HasIndex(u => u.Email)
//                    .IsUnique();

//                entity.Property(u => u.Email)
//                    .IsRequired()
//                    .HasMaxLength(100);

//                entity.Property(u => u.Password)
//                    .IsRequired();

//                entity.Property(u => u.Role)
//                    .IsRequired();

//                entity.Property(u => u.CreatedAt)
//                    .IsRequired()
//                    .HasDefaultValueSql("GETDATE()");

//                entity.Property(u => u.IsActive)
//                    .IsRequired()
//                    .HasDefaultValue((byte)1);

//                entity.Property(u => u.LatestJwtToken)
//                    .IsRequired(false);
//            });

//            base.OnModelCreating(modelBuilder);
//        }
//    }
//}

using Microsoft.EntityFrameworkCore;
using Notes.Entities;

namespace Notes.Repository
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<NotesTitle> NotesTitles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration for User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId); // Primary Key

                entity.Property(u => u.UserId)
                    .IsRequired();

                entity.Property(u => u.Username)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.Password)
                    .IsRequired();

                entity.Property(u => u.Role)
                    .IsRequired();

                entity.Property(u => u.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(u => u.IsActive)
                    .IsRequired()
                    .HasDefaultValue((byte)1);

                entity.Property(u => u.LatestJwtToken)
                    .IsRequired(false);
            });

            // Configuration for NotesTitle entity
            modelBuilder.Entity<NotesTitle>(entity =>
            {
                entity.HasKey(n => n.NoteId); // Primary Key

                entity.Property(n => n.NoteId)
                    .IsRequired();

                entity.Property(n => n.Title)
                    .IsRequired()
                    .HasMaxLength(100); // Assuming a max length for the title

                entity.HasIndex(n => n.Title)
                    .IsUnique(); // Unique constraint on Title

                entity.Property(n => n.DateCreated)
                    .IsRequired()
                    .HasDefaultValueSql("GETDATE()"); // Default value for creation date

                entity.Property(n => n.DateEditied)
                    .IsRequired();

                entity.Property(n => n.Tag)
                    .IsRequired()
                    .HasMaxLength(50); // Assuming a max length for Tag

                entity.Property(n => n.IsActive)
                    .IsRequired()
                    .HasDefaultValue((byte)1); // Default value for IsActive

                entity.Property(n => n.favourite)
                    .IsRequired()
                    .HasDefaultValue((byte)0); // Default value for favourite

                // Foreign key relationship with User
                entity.HasOne(n => n.User)
                    .WithMany(u => u.Notes) // Assuming a collection of NotesTitles in User class
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade); // Cascade delete if a User is deleted
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
