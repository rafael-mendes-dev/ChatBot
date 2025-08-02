using System.ComponentModel.DataAnnotations;

namespace ChatbotApi.Models;

public class Message
{
    public int Id { get; set; }
    public int BotId { get; set; } // Chave estrangeira

    public Bot Bot { get; set; } = null!; // Navegação para o Requests

    [MaxLength(250, ErrorMessage = "Mensagem do usuário não pode ter mais de 500 caracteres."),
     MinLength(1, ErrorMessage = "Mensagem do usuário deve ter pelo menos 1 caractere.")]
    public string UserMessage { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Resposta do bot não pode ter mais de 500 caracteres."),
     MinLength(1, ErrorMessage = "Resposta do bot deve ter pelo menos 1 caractere.")]
    public string BotResponse { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow; // Data e hora da mensagem
}