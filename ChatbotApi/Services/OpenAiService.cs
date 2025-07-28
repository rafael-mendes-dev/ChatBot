using ChatbotApi.Models;
using OpenAI;
using OpenAI.Interfaces;
using OpenAI.Managers;
using OpenAI.ObjectModels.RequestModels;

namespace ChatbotApi.Services;

public class OpenAiService 
{
    private readonly IOpenAIService _openAiService;

    public OpenAiService(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAISettings:ApiKey"]; // Obtém a chave da API do OpenAI da configuração
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new ArgumentException("A chave da API do OpenAI não foi configurada.");
        }

        _openAiService = new OpenAIService(new OpenAiOptions
        {
            ApiKey = apiKey
        });
    }

    public async Task<string> GetChatbotResponseAsync(string botContext, List<Message> chatHistory, string userMessage)
    {
        var messages = new List<ChatMessage>
        {
            ChatMessage.FromSystem(botContext) // Define o contexto do bot como mensagem do sistema
        };
        
        // Adiciona o histórico de mensagens do chat
        foreach (var message in chatHistory.OrderBy(m => m.Timestamp))
        {
            messages.Add(ChatMessage.FromUser(message.UserMessage));
            messages.Add(ChatMessage.FromAssistant(message.BotResponse));
        }
        
        // Adiciona a nova mensagem do usuário 
        messages.Add(ChatMessage.FromUser(userMessage));

        var completionResult = await _openAiService.ChatCompletion.CreateCompletion(new ChatCompletionCreateRequest
        {
            Messages = messages,
            Model = OpenAI.ObjectModels.Models.Gpt_3_5_Turbo, // Define o modelo a ser utilizado
            Temperature = 0.7f, // Controla a criatividade da resposta
            MaxTokens = 200 // Limita o número de tokens na resposta
        });

        if (completionResult.Successful)
        {
            return completionResult.Choices.First().Message.Content!;
        }
        else
        {
            // Exibe o erro caso a chamada à API falhe
            throw new ApplicationException($"Erro ao chamar a API da OpenAI: {completionResult.Error?.Message ?? "Erro desconhecido"}");
        }
    }
}