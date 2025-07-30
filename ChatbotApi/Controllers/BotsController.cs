using System.ComponentModel;
using System.Text.Json.Serialization;
using ChatbotApi.Data;
using ChatbotApi.Dto.Requests;
using ChatbotApi.Models;
using ChatbotApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Controllers;

[ApiController]
[Route("api/bots")]
public class BotsController(AppDbContext context) : ControllerBase
{
    // Cria um novo bot
    // POST: api/Bots
    [HttpPost]
    [EndpointSummary("Cria um novo bot com nome e contexto.")]
    public async Task<ActionResult<Bot>> CreateBot([FromBody] BotDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Context))
            return BadRequest("Nome e contexto do bot são obrigatórios.");

        var bot = new Bot
        {
            Name = dto.Name,
            Context = dto.Context
        };
        
        context.Bots.Add(bot);
        await context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetBot), new { id = bot.Id }, bot);
    }
    
    // Obtém um bot pelo ID
    // GET: api/Bots/{id}
    [HttpGet("{id}")]
    [EndpointSummary("Obtém um bot pelo ID.")]
    public async Task<ActionResult<Bot>> GetBot(int id)
    {
        var bot = await context.Bots.FindAsync(id);
        if (bot == null)
            return NotFound("Requests não encontrado.");
        
        return Ok(bot);
    }
    
    // Obtém todos os bots
    // GET: api/Bots
    [HttpGet]
    [EndpointSummary("Obtém todos os bots cadastrados.")]
    public async Task<ActionResult<IEnumerable<Bot>>> GetBots(int pageNumber = 1, int pageSize = 25)
    {
        var bots = await context.Bots
            .AsNoTracking()
            .OrderBy(b => b.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return Ok(bots);
    }
    
    // Atualiza um bot pelo ID
    // PUT: api/Bots/{id}
    [HttpPut("{id}")]
    [EndpointSummary("Atualiza um bot pelo ID.")]
    public async Task<IActionResult> UpdateBot(int id, [FromBody] BotDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Context))
            return BadRequest("Nome e contexto do bot são obrigatórios.");
        
        var bot = await context.Bots.FindAsync(id);
        if (bot == null)
            return NotFound("Bot não encontrado.");
        
        bot.Name = dto.Name;
        bot.Context = dto.Context;
        
        context.Bots.Update(bot);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    [EndpointSummary("Exclui um bot pelo ID.")]
    public async Task<IActionResult> DeleteBot(int id)
    {
        var bot = await context.Bots.FindAsync(id);
        if (bot == null)
            return NotFound("Bot não encontrado.");
        
        context.Bots.Remove(bot);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
}