using System.ComponentModel.DataAnnotations;

namespace ChatbotApi.Domain.Entities;

public class Message
{
    public int Id { get; set; }
    public int BotId { get; set; }
    
    public Bot Bot { get; set; } = null!;

    [MaxLength(250, ErrorMessage = "Mensagem do usuário não pode ter mais de 250 caracteres."),
     MinLength(1, ErrorMessage = "Mensagem do usuário deve ter pelo menos 1 caractere.")]
    public string UserMessage { get; set; } = string.Empty;
    
    [MaxLength(500, ErrorMessage = "Resposta do bot não pode ter mais de 500 caracteres."),
     MinLength(1, ErrorMessage = "Resposta do bot deve ter pelo menos 1 caractere.")]
    public string BotResponse { get; set; } = string.Empty;
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    public bool IsValid()
    {
        return !string.IsNullOrWhiteSpace(UserMessage) && 
               !string.IsNullOrWhiteSpace(BotResponse) &&
               UserMessage.Length >= 1 && UserMessage.Length <= 250 &&
               BotResponse.Length >= 1 && BotResponse.Length <= 500;
    }
}
