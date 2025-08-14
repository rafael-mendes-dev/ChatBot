using ChatbotApi.Application.DTOs;
using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using ChatbotApi.Domain.Exceptions;

namespace ChatbotApi.Application.Services;

public class BotService : IBotService
{
    private readonly IBotRepository _botRepository;

    public BotService(IBotRepository botRepository)
    {
        _botRepository = botRepository;
    }

    public async Task<BotResponseDto> CreateBotAsync(CreateBotDto dto)
    {
        var bot = new Bot
        {
            Name = dto.Name.Trim(),
            Context = dto.Context.Trim()
        };

        if (!bot.IsValid())
        {
            throw new InvalidBotDataException("Dados do bot são inválidos");
        }

        var createdBot = await _botRepository.CreateAsync(bot);
        
        return new BotResponseDto
        {
            Id = createdBot.Id,
            Name = createdBot.Name,
            Context = createdBot.Context,
            CreatedAt = createdBot.CreatedAt,
            UpdatedAt = createdBot.UpdatedAt
        };
    }

    public async Task<BotResponseDto> GetBotByIdAsync(int id)
    {
        var bot = await _botRepository.GetByIdAsync(id);
        if (bot == null)
        {
            throw new BotNotFoundException(id);
        }

        return new BotResponseDto
        {
            Id = bot.Id,
            Name = bot.Name,
            Context = bot.Context,
            CreatedAt = bot.CreatedAt,
            UpdatedAt = bot.UpdatedAt
        };
    }

    public async Task<IEnumerable<BotResponseDto>> GetAllBotsAsync(int pageNumber = 1, int pageSize = 25)
    {
        var bots = await _botRepository.GetAllAsync(pageNumber, pageSize);
        
        return bots.Select(bot => new BotResponseDto
        {
            Id = bot.Id,
            Name = bot.Name,
            Context = bot.Context,
            CreatedAt = bot.CreatedAt,
            UpdatedAt = bot.UpdatedAt
        });
    }

    public async Task<BotResponseDto> UpdateBotAsync(int id, UpdateBotDto dto)
    {
        var bot = await _botRepository.GetByIdAsync(id);
        if (bot == null)
        {
            throw new BotNotFoundException(id);
        }

        bot.Name = dto.Name.Trim();
        bot.Context = dto.Context.Trim();
        bot.UpdatedAt = DateTime.UtcNow;

        if (!bot.IsValid())
        {
            throw new InvalidBotDataException("Dados do bot são inválidos");
        }

        var updatedBot = await _botRepository.UpdateAsync(bot);
        
        return new BotResponseDto
        {
            Id = updatedBot.Id,
            Name = updatedBot.Name,
            Context = updatedBot.Context,
            CreatedAt = updatedBot.CreatedAt,
            UpdatedAt = updatedBot.UpdatedAt
        };
    }

    public async Task DeleteBotAsync(int id)
    {
        var exists = await _botRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new BotNotFoundException(id);
        }

        await _botRepository.DeleteAsync(id);
    }
}
