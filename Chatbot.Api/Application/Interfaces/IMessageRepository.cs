using ChatbotApi.Domain.Entities;

namespace ChatbotApi.Application.Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task<IEnumerable<Message>> GetByBotIdAsync(int botId);
    Task<IEnumerable<Message>> GetRecentMessagesByBotIdAsync(int botId, int limit = 5);
}
