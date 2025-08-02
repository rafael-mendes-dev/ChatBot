using System.Net.Http.Json;
using ChatbotApi.Dto.Requests;
using ChatbotApi.Dto.Responses;
using ChatbotApi.Models;
using Microsoft.AspNetCore.Mvc.Testing;

namespace ChatbotTests.MessagesControllerTests;

[TestClass]
public class MessagesControllerTests
{
    private static WebApplicationFactory<Program> _factory = null!;
    private static HttpClient _client = null!;

    [ClassInitialize]
    public static void Setup(TestContext context)
    {
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }
    
    [TestMethod]
    public async Task Cria_bot_e_mensagem_retorna_Ok_e_valor_nao_nulo()
    {
        var newBot = new Bot
        {
            Name = "Bot teste",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        
        // Assert - Verificação da criação
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Arrange - Cria nova classe mensagem
        var newMessage = new SendMessageRequest
        {
            UserMessage = "Mensagem de teste"
        };

        // Act - Recebe mensagem do bot
        var createResponseMessage = await _client.PostAsJsonAsync($"/api/messages/{botId}", newMessage);

        // Assert - Verificação da criação
        createResponseMessage.EnsureSuccessStatusCode();
        var createdMessage = await createResponseMessage.Content.ReadFromJsonAsync<Message>();
        Assert.IsNotNull(createdMessage);

        // Act - Busca da mensagem pelo ID do bot
        var getResponse = await _client.GetAsync($"/api/messages/{botId}");

        // Assert - Verificação da busca
        getResponse.EnsureSuccessStatusCode();
        var fetchedMessage = await getResponse.Content.ReadFromJsonAsync<List<GetMessagesResponse>>();
        Assert.IsNotNull(fetchedMessage);
        Assert.AreEqual(newMessage.UserMessage, fetchedMessage[0].UserMessage, "Esperado conteúdo da mensagem ser igual ao conteúdo da mensagem enviada.");
        Assert.IsNotNull(fetchedMessage[0].BotResponse, "Esperado resposta do bot não ser nula.");
        
        // Act e Assert: Limpeza (Tear Down)
        // Exclui o bot para garantir que o ambiente fique limpo para o próximo teste
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }
}