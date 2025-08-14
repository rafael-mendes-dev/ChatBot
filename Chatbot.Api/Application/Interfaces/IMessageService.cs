using ChatbotApi.Application.DTOs;

namespace ChatbotApi.Application.Interfaces;

public interface IMessageService
{
    Task<MessageResponseDto> SendMessageAsync(int botId, SendMessageDto dto);
    Task<IEnumerable<MessageResponseDto>> GetMessagesByBotIdAsync(int botId);
}
