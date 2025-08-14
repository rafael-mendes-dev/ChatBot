using ChatbotApi.Application.DTOs;

namespace ChatbotApi.Application.Interfaces;

public interface IBotService
{
    Task<BotResponseDto> CreateBotAsync(CreateBotDto dto);
    Task<BotResponseDto> GetBotByIdAsync(int id);
    Task<IEnumerable<BotResponseDto>> GetAllBotsAsync(int pageNumber = 1, int pageSize = 25);
    Task<BotResponseDto> UpdateBotAsync(int id, UpdateBotDto dto);
    Task DeleteBotAsync(int id);
}
