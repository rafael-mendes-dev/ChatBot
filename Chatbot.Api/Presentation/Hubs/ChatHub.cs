using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using ChatbotApi.Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;

namespace ChatbotApi.Presentation.Hubs;

public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly IBotRepository _botRepository;

    public ChatHub(IMessageService messageService, IBotRepository botRepository)
    {
        _messageService = messageService;
        _botRepository = botRepository;
    }
    
    public async Task SendMessageToBot(int botId, string userMessage)
    {
        if (string.IsNullOrWhiteSpace(userMessage))
        {
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = "A mensagem não pode ser vazia." });
            return;
        }
        
        try
        {
            // Verifica se o bot existe
            var bot = await _botRepository.GetByIdAsync(botId);
            if (bot == null)
            {
                await Clients.Caller.SendAsync("ReceiveMessage", new { error = "Bot não encontrado." });
                return;
            }

            // Envia a mensagem usando o serviço de aplicação
            var sendMessageDto = new Application.DTOs.SendMessageDto { UserMessage = userMessage };
            var response = await _messageService.SendMessageAsync(botId, sendMessageDto);
            
            // Envia a resposta para o cliente
            await Clients.Caller.SendAsync("ReceiveMessage", new
            {
                botId = botId,
                userMessage = response.UserMessage,
                botResponse = response.BotResponse,
                timestamp = response.Timestamp,
                isUser = false
            });
        }
        catch (BotNotFoundException)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = "Bot não encontrado." });
        }
        catch (InvalidMessageDataException ex)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = ex.Message });
        }
        catch (ApplicationException ex)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = $"Erro ao gerar resposta do bot: {ex.Message}" });
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = $"Erro inesperado: {ex.Message}" });
        }
    }
    
    public async Task GetBotHistory(int botId)
    {
        try
        {
            var messages = await _messageService.GetMessagesByBotIdAsync(botId);

            await Clients.Caller.SendAsync("ReceiveHistory", messages.Select(m => new {
                botId = botId,
                userMessage = m.UserMessage,
                botResponse = m.BotResponse,
                timestamp = m.Timestamp,
                isUser = false
            }).ToList());
        }
        catch (BotNotFoundException)
        {
            await Clients.Caller.SendAsync("ReceiveHistory", new { error = "Bot não encontrado." });
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("ReceiveHistory", new { error = $"Erro ao obter histórico: {ex.Message}" });
        }
    }
}
