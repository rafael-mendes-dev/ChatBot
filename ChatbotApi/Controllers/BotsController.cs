using System.ComponentModel;
using System.Text.Json.Serialization;
using ChatbotApi.Data;
using ChatbotApi.DTO.Bot;
using ChatbotApi.Models;
using ChatbotApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI.Managers;

namespace ChatbotApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BotsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly OpenAiService _openAiService;

    public BotsController(AppDbContext context, OpenAiService openAiService)
    {
        _context = context;
        _openAiService = openAiService;
    }
    
    // Cria um novo bot
    // POST: api/Bots
    [HttpPost]
    [EndpointSummary("Cria um novo bot com nome e contexto.")]
    public async Task<ActionResult<Bot>> CreateBot([FromBody] CreateBotRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Context))
            return BadRequest("Nome e contexto do bot são obrigatórios.");

        var bot = new Bot
        {
            Name = request.Name,
            Context = request.Context
        };
        
        _context.Bots.Add(bot);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetBot), new { id = bot.Id }, bot);
    }
    
    // Obtém um bot pelo ID
    // GET: api/Bots/{id}
    [HttpGet("{id}")]
    [EndpointSummary("Obtém um bot pelo ID.")]
    public async Task<ActionResult<Bot>> GetBot(int id)
    {
        var bot = await _context.Bots.FindAsync(id);
        if (bot == null)
            return NotFound("Bot não encontrado.");
        
        return Ok(bot);
    }
    
    // Obtém todos os bots
    // GET: api/Bots
    [HttpGet]
    [EndpointSummary("Obtém todos os bots cadastrados.")]
    public async Task<ActionResult<IEnumerable<Bot>>> GetBots(int pageNumber = 1, int pageSize = 25)
    {
        var bots = await _context.Bots
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return Ok(bots);
    }
    
    // Envia uma mensagem para o bot e obtém a resposta
    // POST: api/Bots/{botId}/messages
    [HttpPost("{botId}/messages")]
    [EndpointSummary("Envia uma mensagem para o bot e obtém a resposta.")]
    public async Task<ActionResult<Bot>> SendMessage(int botId, [FromBody] MessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserMessage))
            return BadRequest("A mensagem do usuário é obrigatória.");
        
        var bot = await _context.Bots.FindAsync(botId);
        if (bot == null)
            return NotFound("Bot não encontrado.");
        
        // Recupera o histórico de mensagens
        // Limite o histórico para as últimas N mensagens para controlar o tamanho do prompt
        var chatHistory = await _context.Messages
                                                    .Where(m => m.BotId == botId)
                                                    .OrderByDescending(m => m.Timestamp) // Pega as mais recentes primeiro
                                                    .Take(10) // Pega as últimas 10 mensagens
                                                    .OrderBy(m => m.Timestamp) // Ordena novamente para a ordem cronológica
                                                    .ToListAsync();

        try
        {
            // Obtem a resposta do bot 
            var botResponseContent =
                await _openAiService.GetChatbotResponseAsync(bot.Context, chatHistory, request.UserMessage);

            // Cria e salva a nova mensagem (tanto do usuário quanto a resposta do bot)
            var newMessage = new Message
            {
                BotId = botId,
                UserMessage = request.UserMessage,
                BotResponse = botResponseContent,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(newMessage);
            await _context.SaveChangesAsync();

            return Ok(newMessage);
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
    [HttpGet("{botId}/messages")]
    [EndpointSummary("Obtém todas as mensagens de um bot específico, ordenadas por data e hora.")]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages(int botId)
    {
        var messages = await _context.Messages
                                                .Where(m => m.BotId == botId)
                                                .OrderBy(m => m.Timestamp) // Ordena por data e hora
                                                .ToListAsync();

        if (!messages.Any())
            return Ok(new List<Message>()); // Retorna uma lista vazia se não houver mensagens

        return Ok(messages); 
    }
    
    public class MessageRequest
    {
        public string UserMessage { get; set; } = string.Empty; // Mensagem do usuário
    }
}