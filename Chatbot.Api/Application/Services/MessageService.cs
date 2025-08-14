using ChatbotApi.Application.DTOs;
using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using ChatbotApi.Domain.Exceptions;

namespace ChatbotApi.Application.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly IBotRepository _botRepository;
    private readonly IAiService _aiService;

    public MessageService(
        IMessageRepository messageRepository,
        IBotRepository botRepository,
        IAiService aiService)
    {
        _messageRepository = messageRepository;
        _botRepository = botRepository;
        _aiService = aiService;
    }

    public async Task<MessageResponseDto> SendMessageAsync(int botId, SendMessageDto dto)
    {
        // Verifica se o bot existe
        var bot = await _botRepository.GetByIdAsync(botId);
        if (bot == null)
        {
            throw new BotNotFoundException(botId);
        }

        // Valida a mensagem
        if (string.IsNullOrWhiteSpace(dto.UserMessage))
        {
            throw new InvalidMessageDataException("Mensagem do usuário é obrigatória");
        }

        // Obtém o histórico recente de mensagens
        var chatHistory = await _messageRepository.GetRecentMessagesByBotIdAsync(botId, 5);

        try
        {
            // Obtém a resposta da IA
            var botResponse = await _aiService.GetChatbotResponseAsync(
                bot.Context, 
                chatHistory, 
                dto.UserMessage.Trim());

            // Cria e salva a nova mensagem
            var message = new Message
            {
                BotId = botId,
                UserMessage = dto.UserMessage.Trim(),
                BotResponse = botResponse,
                Timestamp = DateTime.UtcNow
            };

            if (!message.IsValid())
            {
                throw new InvalidMessageDataException("Dados da mensagem são inválidos");
            }

            var savedMessage = await _messageRepository.CreateAsync(message);

            return new MessageResponseDto
            {
                UserMessage = savedMessage.UserMessage,
                BotResponse = savedMessage.BotResponse,
                Timestamp = savedMessage.Timestamp
            };
        }
        catch (Exception ex) when (ex is not DomainException)
        {
            throw new ApplicationException($"Erro ao processar mensagem: {ex.Message}");
        }
    }

    public async Task<IEnumerable<MessageResponseDto>> GetMessagesByBotIdAsync(int botId)
    {
        // Verifica se o bot existe
        var bot = await _botRepository.GetByIdAsync(botId);
        if (bot == null)
        {
            throw new BotNotFoundException(botId);
        }

        var messages = await _messageRepository.GetByBotIdAsync(botId);

        return messages.Select(m => new MessageResponseDto
        {
            UserMessage = m.UserMessage,
            BotResponse = m.BotResponse,
            Timestamp = m.Timestamp
        });
    }
}
