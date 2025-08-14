using ChatbotApi.Domain.Entities;

namespace ChatbotApi.Application.Interfaces;

public interface IAiService
{
    Task<string> GetChatbotResponseAsync(string botContext, IEnumerable<Message> chatHistory, string userMessage);
}
