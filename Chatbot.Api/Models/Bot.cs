using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChatbotApi.Models;

public class Bot
{
    public int Id { get; set; }

    [MaxLength(50, ErrorMessage = "Nome do bot não pode ter mais de 50 caracteres."),
     MinLength(3, ErrorMessage = "Nome do bot deve ter pelo menos 3 caracteres.")]
    public string Name { get; set; } = string.Empty;
    [MaxLength(250, ErrorMessage = "Descrição do bot não pode ter mais de 250 caracteres."),
     MinLength(3, ErrorMessage = "Descrição do bot deve ter pelo menos 3 caracteres.")]
    public string Context { get; set; } = string.Empty;
    
    [JsonIgnore]
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}