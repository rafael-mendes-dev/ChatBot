using ChatbotApi.Models;

namespace ChatbotApi.Util;

public interface IGeminiService
{
    Task<string> GetChatbotResponseAsync(string botContext, List<Message> chatHistory, string userMessage);
}