namespace ChatbotApi.Models;

public class Message
{
    public int Id { get; set; }
    public int BotId { get; set; } // Chave estrangeira

    public Bot Bot { get; set; } = new(); // Navegação para o Bot

    public string UserMessage { get; set; } = string.Empty;
    public string BotResponse { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow; // Data e hora da mensagem
}