﻿using ChatbotApi.Data;
using ChatbotApi.Models;
using ChatbotApi.Services;
using ChatbotApi.Util;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatbotApi.Hubs;

public class ChatHub(IGeminiService geminiService, AppDbContext context) : Hub // SignalR Hub para comunicação em tempo real com os clientes
{
    
    // Metodo que o cliente chama para enviar uma mensagem
    public async Task SendMessageToBot(int botId, string userMessage)
    {
        if (string.IsNullOrWhiteSpace(userMessage))
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = "A mensagem não pode ser vazia."});
        
        var bot = await context.Bots.FindAsync(botId);
        if (bot == null)
            await Clients.Caller.SendAsync("ReceiveMessage", new { error = "Requests não encontrado." });
        
        // Recupera o histórico de mensagens do bot
        var chatHistory = await context.Messages
            .Where(m => m.BotId == botId)
            .OrderByDescending(m => m.Timestamp)
            .Take(10) // Limite para as últimas 10 mensagens
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        try
        {
            // Obtem a resposta do bot
            var botResponseContent =
                await geminiService.GetChatbotResponseAsync(bot!.Context, chatHistory, userMessage);

            var newMessage = new Message
            {
                BotId = botId,
                UserMessage = userMessage,
                BotResponse = botResponseContent,
                Timestamp = DateTime.UtcNow
            };
            
            context.Messages.Add(newMessage);
            await context.SaveChangesAsync();
            
            // Envia a mensagem completa (com a resposta do bot) de volta para o cliente que a enviou
            await Clients.Caller.SendAsync("ReceiveMessage", new
            {
                id = newMessage.Id,
                botId = newMessage.BotId,
                userMessage = newMessage.UserMessage,
                botResponse = newMessage.BotResponse,
                timestamp = newMessage.Timestamp,
                isUser = false // Flag para o front-end saber que é a resposta do bot
            });
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
    
    // Método que o cliente chama para obter o histórico de mensagens do bot
    public async Task GetBotHistory(int botId)
    {
        var messages = await context.Messages
            .Where(m => m.BotId == botId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        // Envia o histórico para o cliente que fez a requisição
        await Clients.Caller.SendAsync("ReceiveHistory", messages.Select(m => new {
            id = m.Id,
            botId = m.BotId,
            userMessage = m.UserMessage,
            botResponse = m.BotResponse,
            timestamp = m.Timestamp,
            isUser = false
        }).ToList());
    }
}