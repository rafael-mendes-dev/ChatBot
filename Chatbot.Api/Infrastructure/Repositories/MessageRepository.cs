using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using ChatbotApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly AppDbContext _context;

    public MessageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Message> CreateAsync(Message message)
    {
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<IEnumerable<Message>> GetByBotIdAsync(int botId)
    {
        return await _context.Messages
            .Where(m => m.BotId == botId)
            .OrderBy(m => m.Timestamp)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Message>> GetRecentMessagesByBotIdAsync(int botId, int limit = 5)
    {
        return await _context.Messages
            .Where(m => m.BotId == botId)
            .OrderByDescending(m => m.Timestamp)
            .Take(limit)
            .OrderBy(m => m.Timestamp)
            .AsNoTracking()
            .ToListAsync();
    }
}
