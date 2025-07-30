using ChatbotApi.Models;
using ChatbotApi.Util;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.AIPlatform.V1;
using Grpc.Auth;
using Grpc.Core;

namespace ChatbotApi.Services;

public class GeminiService : IGeminiService
{
    private readonly PredictionServiceClient _predictionServiceClient;
    private readonly string _projectId;
    private readonly string _modelName;
    private readonly string _location;

    public GeminiService(IConfiguration configuration)
    {
        _projectId = configuration["GeminiSettings:ProjectId"] ?? throw new ArgumentException("Google Cloud ProjectId não configurado em appsettings.json.");
        _location = configuration["GeminiSettings:Location"] ?? "us-central1"; // Região padrão se não configurada
		_modelName = "gemini-2.5-pro";
        var credentialsPath = configuration["GeminiSettings:CredentialsPath"] ?? throw new ArgumentException("Caminho para as credenciais do Google Cloud não configurado em appsettings.json.");
        

        GoogleCredential credential;

			if (!string.IsNullOrEmpty(credentialsPath))
            {
                // Tenta carregar as credenciais diretamente do arquivo JSON
                if (!File.Exists(credentialsPath))
                {
                    throw new FileNotFoundException($"Arquivo de credenciais não encontrado no caminho: {credentialsPath}");
                }
                credential = GoogleCredential.FromFile(credentialsPath);
            }
            else
            {
                // Caso o caminho não esteja configurado, tenta a autenticação padrão (via GOOGLE_APPLICATION_CREDENTIALS)
                credential = GoogleCredential.GetApplicationDefault();
            }

            // Necessário garantir os escopos para Vertex AI.
            credential = credential.CreateScoped(new string[] { "https://www.googleapis.com/auth/cloud-platform" });

        _predictionServiceClient = new PredictionServiceClientBuilder
        {
            Endpoint = $"{_location}-aiplatform.googleapis.com",
            ChannelCredentials = credential.ToChannelCredentials()
        }.Build();
    }

    public async Task<string> GetChatbotResponseAsync(string botContext, List<Message> chatHistory, string userMessage)
    {
        var contents = new List<Content>(); 
        
        if (!string.IsNullOrWhiteSpace(botContext))
        {
            contents.Add(new Content
            {
                Role = "user", // Instruções iniciais do bot
                Parts = { new Part { Text = botContext } }
            });
            contents.Add(new Content
            {
                Role = "model", // Modelo "aceita" as instruções
                Parts = { new Part { Text = "Entendido. Estou pronto para ajudar." } }
            });
        }

        // Adicione o histórico da conversa existente
        // Certifique-se de que a ordem está correta (user, model, user, model...)
        foreach (var msg in chatHistory.OrderBy(m => m.Timestamp))
        {
            contents.Add(new Content
            {
                Role = "user",
                Parts = { new Part { Text = msg.UserMessage } }
            });
            contents.Add(new Content
            {
                Role = "model",
                Parts = { new Part { Text = msg.BotResponse } }
            });
        }

        // Adicione a nova mensagem do usuário
        contents.Add(new Content
        {
            Role = "user",
            Parts = { new Part { Text = userMessage } }
        });

        // Constrói o request para o modelo Gemini no Vertex AI
        var generateContentRequest = new GenerateContentRequest
        {
            Model = $"projects/{_projectId}/locations/{_location}/publishers/google/models/{_modelName}",
            Contents = { contents },
            GenerationConfig = new GenerationConfig
            {
                Temperature = 0.7f,
                MaxOutputTokens = 1024
            }
        };

        try
        {
            var response = await _predictionServiceClient.GenerateContentAsync(generateContentRequest);

            return response.Candidates.FirstOrDefault()?.Content?.Parts.FirstOrDefault()?.Text ?? "Não foi possível gerar uma resposta.";
        }
        catch (RpcException ex) // Erros específicos da API gRPC
        {
            // Inclua detalhes do status para depuração
            throw new ApplicationException($"Erro na API do Google Gemini (RPC): Status: {ex.Status.StatusCode}, Detalhe: {ex.Status.Detail}");
        }
        catch (Exception ex)
        {
            throw new ApplicationException($"Erro inesperado ao chamar a API do Google Gemini: {ex.Message}");
        }
    }
}