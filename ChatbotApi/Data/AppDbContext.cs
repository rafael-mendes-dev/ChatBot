using ChatbotApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Bot> Bots { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bot>()
            .HasMany(b => b.Messages)
            .WithOne(m => m.Bot)
            .HasForeignKey(m => m.BotId)
            .OnDelete(DeleteBehavior.Cascade); // Configura o comportamento de exclusão em cascata
        
        base.OnModelCreating(modelBuilder);
    }
}