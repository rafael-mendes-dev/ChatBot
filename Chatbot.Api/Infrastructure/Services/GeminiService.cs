using ChatbotApi.Application.Interfaces;
using ChatbotApi.Domain.Entities;
using GenerativeAI;
using GenerativeAI.Types;

namespace ChatbotApi.Infrastructure.Services;

public class GeminiService : IAiService
{
    private readonly GenerativeModel _generativeModel;

    public GeminiService(IConfiguration configuration)
    {
        var apiKey = configuration["GeminiSettings:ApiKey"] 
            ?? throw new ArgumentException("ApiKey não configurado em appsettings.json.");
        
        var googleAiClient = new GoogleAi(apiKey);
        _generativeModel = googleAiClient.CreateGenerativeModel("models/gemini-1.5-flash");
    }

    public async Task<string> GetChatbotResponseAsync(string botContext, IEnumerable<Message> chatHistory, string userMessage)
    {
        try
        {
            var contents = new List<Content>();

            // Adiciona o contexto do bot, se fornecido
            if (!string.IsNullOrWhiteSpace(botContext))
            {
                contents.Add(new Content(prompt: botContext, role: "user"));
                contents.Add(new Content(prompt: "Entendido. Estou pronto para ajudar.", role: "model"));
            }

            // Adiciona o histórico de mensagens existentes da conversa
            foreach (var msg in chatHistory.OrderBy(m => m.Timestamp))
            {
                contents.Add(new Content(prompt: msg.UserMessage, role: "user"));
                contents.Add(new Content(prompt: msg.BotResponse, role: "model"));
            }
                
            // Adiciona a nova mensagem do usuário no final da lista
            contents.Add(new Content(prompt: userMessage, role: "user"));
            
            var request = new GenerateContentRequest
            {
                Contents = contents,
                GenerationConfig = new GenerationConfig
                {
                    Temperature = 0.7f,
                    MaxOutputTokens = 1024
                }
            };
            
            var response = await _generativeModel.GenerateContentAsync(request);
            
            return response.Text() ?? "Desculpe, não consegui gerar uma resposta.";
        }
        catch (Exception ex)
        {
            throw new ApplicationException($"Erro ao chamar a API do Google Gemini: {ex.Message}");
        }
    }
}
