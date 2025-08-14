using ChatbotApi.Application.DTOs;
using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ChatbotApi.Presentation.Controllers;

[ApiController]
[Route("api/bots")]
[EnableRateLimiting("fixed")]
public class BotsController : ControllerBase
{
    private readonly IBotService _botService;

    public BotsController(IBotService botService)
    {
        _botService = botService;
    }

    [HttpPost]
    [EndpointSummary("Cria um novo bot com nome e contexto.")]
    public async Task<ActionResult<BotResponseDto>> CreateBot([FromBody] CreateBotDto dto)
    {
        try
        {
            var bot = await _botService.CreateBotAsync(dto);
            return CreatedAtAction(nameof(GetBot), new { id = bot.Id }, bot);
        }
        catch (InvalidBotDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
        }
    }
    
    [HttpGet("{id}")]
    [EndpointSummary("Obtém um bot pelo ID.")]
    public async Task<ActionResult<BotResponseDto>> GetBot(int id)
    {
        try
        {
            var bot = await _botService.GetBotByIdAsync(id);
            return Ok(bot);
        }
        catch (BotNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
        }
    }
    
    [HttpGet]
    [EndpointSummary("Obtém todos os bots cadastrados.")]
    public async Task<ActionResult<IEnumerable<BotResponseDto>>> GetBots(int pageNumber = 1, int pageSize = 25)
    {
        try
        {
            var bots = await _botService.GetAllBotsAsync(pageNumber, pageSize);
            return Ok(bots);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
        }
    }
    
    [HttpPut("{id}")]
    [EndpointSummary("Atualiza um bot pelo ID.")]
    public async Task<IActionResult> UpdateBot(int id, [FromBody] UpdateBotDto dto)
    {
        try
        {
            await _botService.UpdateBotAsync(id, dto);
            return NoContent();
        }
        catch (BotNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidBotDataException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
        }
    }
    
    [HttpDelete("{id}")]
    [EndpointSummary("Exclui um bot pelo ID.")]
    public async Task<IActionResult> DeleteBot(int id)
    {
        try
        {
            await _botService.DeleteBotAsync(id);
            return NoContent();
        }
        catch (BotNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erro interno do servidor: {ex.Message}" });
        }
    }
}
