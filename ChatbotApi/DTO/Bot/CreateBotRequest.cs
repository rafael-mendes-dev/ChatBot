namespace ChatbotApi.DTO.Bot;

public class CreateBotRequest
{
    public string Name { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
}