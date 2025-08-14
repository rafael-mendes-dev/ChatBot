using System.ComponentModel.DataAnnotations;

namespace ChatbotApi.Application.DTOs;

public class SendMessageDto
{
    [Required(ErrorMessage = "Mensagem do usuário é obrigatória")]
    [MaxLength(250, ErrorMessage = "Mensagem do usuário não pode ter mais de 250 caracteres")]
    [MinLength(1, ErrorMessage = "Mensagem do usuário deve ter pelo menos 1 caractere")]
    public string UserMessage { get; set; } = string.Empty;
}

public class MessageResponseDto
{
    public string UserMessage { get; set; } = string.Empty;
    public string BotResponse { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
