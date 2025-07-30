﻿namespace ChatbotApi.Dto.Responses;

public class GetMessagesResponse
{
    public string UserMessage { get; set; } = string.Empty;
    public string BotResponse { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}