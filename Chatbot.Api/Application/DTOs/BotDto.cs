using System.ComponentModel.DataAnnotations;

namespace ChatbotApi.Application.DTOs;

public class CreateBotDto
{
    [Required(ErrorMessage = "Nome do bot é obrigatório")]
    [MaxLength(50, ErrorMessage = "Nome do bot não pode ter mais de 50 caracteres")]
    [MinLength(3, ErrorMessage = "Nome do bot deve ter pelo menos 3 caracteres")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Contexto do bot é obrigatório")]
    [MaxLength(250, ErrorMessage = "Contexto do bot não pode ter mais de 250 caracteres")]
    [MinLength(3, ErrorMessage = "Contexto do bot deve ter pelo menos 3 caracteres")]
    public string Context { get; set; } = string.Empty;
}

public class UpdateBotDto
{
    [Required(ErrorMessage = "Nome do bot é obrigatório")]
    [MaxLength(50, ErrorMessage = "Nome do bot não pode ter mais de 50 caracteres")]
    [MinLength(3, ErrorMessage = "Nome do bot deve ter pelo menos 3 caracteres")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Contexto do bot é obrigatório")]
    [MaxLength(250, ErrorMessage = "Contexto do bot não pode ter mais de 250 caracteres")]
    [MinLength(3, ErrorMessage = "Contexto do bot deve ter pelo menos 3 caracteres")]
    public string Context { get; set; } = string.Empty;
}

public class BotResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
