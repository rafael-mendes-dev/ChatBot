using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using ChatbotApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Infrastructure.Repositories;

public class BotRepository : IBotRepository
{
    private readonly AppDbContext _context;

    public BotRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Bot?> GetByIdAsync(int id)
    {
        return await _context.Bots
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Bot>> GetAllAsync(int pageNumber = 1, int pageSize = 25)
    {
        return await _context.Bots
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Bot> CreateAsync(Bot bot)
    {
        _context.Bots.Add(bot);
        await _context.SaveChangesAsync();
        return bot;
    }

    public async Task<Bot> UpdateAsync(Bot bot)
    {
        _context.Bots.Update(bot);
        await _context.SaveChangesAsync();
        return bot;
    }

    public async Task DeleteAsync(int id)
    {
        var bot = await _context.Bots.FindAsync(id);
        if (bot != null)
        {
            _context.Bots.Remove(bot);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Bots.AnyAsync(b => b.Id == id);
    }
}
