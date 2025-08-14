using ChatbotApi.Application.DTOs;
using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ChatbotApi.Presentation.Controllers;

[ApiController]
[Route("api/messages")]
[EnableRateLimiting("fixed")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpPost("{botId}")]
    [EndpointSummary("Envia uma mensagem para o bot e obtém a resposta.")]
    public async Task<ActionResult<MessageResponseDto>> SendMessage(int botId, [FromBody] SendMessageDto dto)
    {
        if (botId <= 0)
            return BadRequest(new { message = "O ID do bot deve ser um número positivo." });
        
        try
        {
            var response = await _messageService.SendMessageAsync(botId, dto);
            return Ok(response);
        }
        catch (BotNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidMessageDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ApplicationException ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Ocorreu um erro inesperado: {ex.Message}" });
        }
    }
    
    [HttpGet("{botId}")]
    [EndpointSummary("Obtém todas as mensagens de um bot específico, ordenadas por data e hora.")]
    public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetMessages(int botId)
    {
        try
        {
            var messages = await _messageService.GetMessagesByBotIdAsync(botId);
            return Ok(messages);
        }
        catch (BotNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Ocorreu um erro inesperado: {ex.Message}" });
        }
    }
}
