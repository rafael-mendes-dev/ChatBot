using ChatbotApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Bot> Bots { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Bot>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Context).IsRequired().HasMaxLength(250);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserMessage).IsRequired().HasMaxLength(250);
            entity.Property(e => e.BotResponse).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Timestamp).IsRequired();
            
            entity.HasOne(e => e.Bot)
                  .WithMany(e => e.Messages)
                  .HasForeignKey(e => e.BotId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
