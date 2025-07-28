using System.Text.Json.Serialization;

namespace ChatbotApi.Models;

public class Bot
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
    
    [JsonIgnore]
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}