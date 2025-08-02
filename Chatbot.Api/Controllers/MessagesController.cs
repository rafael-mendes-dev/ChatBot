using ChatbotApi.Data;
using ChatbotApi.Dto.Requests;
using ChatbotApi.Dto.Responses;
using ChatbotApi.Models;
using ChatbotApi.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Controllers;

[ApiController]
[Route("api/messages")]
[EnableRateLimiting("fixed")]
public class MessagesController (AppDbContext context, IGeminiService geminiService) : ControllerBase
{
    // Envia uma mensagem para o bot e obtém a resposta
    // POST: api/Bots/{botId}/messages
    [HttpPost("{botId}")]
    [EndpointSummary("Envia uma mensagem para o bot e obtém a resposta.")]
    public async Task<ActionResult<GetMessagesResponse>> SendMessage(int botId, [FromBody] SendMessageRequest request)
    {
        if (botId <= 0)
            return BadRequest("O ID do bot deve ser um número positivo.");
        
        if (string.IsNullOrWhiteSpace(request.UserMessage))
            return BadRequest("A mensagem do usuário é obrigatória.");
        
        var bot = await context.Bots.FindAsync(botId);
        if (bot == null)
            return NotFound("Bot não encontrado.");
        
        // Recupera o histórico de mensagens
        // Limita o histórico para as últimas N mensagens para controlar o tamanho do prompt
        var chatHistory = await context.Messages
                                        .Where(m => m.BotId == botId)
                                        .OrderByDescending(m => m.Timestamp) // Pega as mais recentes primeiro
                                        .Take(5) // Pega as últimas 5 mensagens
                                        .OrderBy(m => m.Timestamp) // Ordena novamente para a ordem cronológica
                                        .ToListAsync();

        try
        {
            // Obtem a resposta do bot 
            var botResponseContent =
                await geminiService.GetChatbotResponseAsync(bot.Context, chatHistory, request.UserMessage);

            // Cria e salva a nova mensagem (tanto do usuário quanto a resposta do bot)
            var newMessage = new Message
            {
                BotId = botId,
                UserMessage = request.UserMessage,
                BotResponse = botResponseContent,
                Timestamp = DateTime.UtcNow
            };

            context.Messages.Add(newMessage);
            await context.SaveChangesAsync();

            return Ok(new GetMessagesResponse
            {
                UserMessage = newMessage.UserMessage,
                BotResponse = newMessage.BotResponse,
                Timestamp = newMessage.Timestamp
            });
        }
        catch (ApplicationException e)
        {
            return StatusCode(500, new { message = e.Message });
        }
        catch (Exception e)
        {
            return StatusCode(500, new { message = $"Ocorreu um erro inesperado: {e.Message}" });
        }
    }
    
    // Obtém todas as mensagens de um bot específico
    // GET: api/Bots/{botId}/messages
    [HttpGet("{botId}")]
    [EndpointSummary("Obtém todas as mensagens de um bot específico, ordenadas por data e hora.")]
    public async Task<ActionResult<IEnumerable<GetMessagesResponse>>> GetMessages(int botId)
    {
        try
        {
            var messages = await context.Messages
                .Where(m => m.BotId == botId)
                .OrderBy(m => m.Timestamp) // Ordena por data e hora
                .ToListAsync();

            var responseMessages = messages.Select(m => new GetMessagesResponse
            {
                UserMessage = m.UserMessage,
                BotResponse = m.BotResponse,
                Timestamp = m.Timestamp
            }).ToList();


            if (!responseMessages.Any())
                return Ok(new List<GetMessagesResponse>()); // Retorna uma lista vazia se não houver mensagens

            return Ok(responseMessages);
        }
        catch (Exception e)
        {
            return StatusCode(500, new { message = $"Ocorreu um erro inesperado: {e.Message}" });
        }
    }
}