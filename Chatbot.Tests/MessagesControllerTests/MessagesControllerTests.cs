using System.Net;
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

    [TestMethod]
    public async Task Envia_mensagem_com_bot_inexistente_retorna_NotFound()
    {
        // Arrange
        var botIdInexistente = 99999;
        var newMessage = new SendMessageRequest
        {
            UserMessage = "Mensagem para bot inexistente"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botIdInexistente}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode, "Esperado status 404 para bot inexistente.");
    }
    
    [TestMethod]
    public async Task Envia_mensagem_vazia_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot teste",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Arrange - Mensagem vazia
        var newMessage = new SendMessageRequest
        {
            UserMessage = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botId}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para mensagem vazia.");
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }
    
    [TestMethod]
    public async Task Envia_mensagem_com_bot_id_invalido_retorna_BadRequest()
    {
        // Arrange
        var botIdInvalido = -1;
        var newMessage = new SendMessageRequest
        {
            UserMessage = "Mensagem de teste"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botIdInvalido}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para ID de bot inválido.");
    }
    
    [TestMethod]
    public async Task Busca_mensagens_de_bot_inexistente_retorna_lista_vazia()
    {
        // Arrange
        var botIdInexistente = 99999;

        // Act
        var response = await _client.GetAsync($"/api/messages/{botIdInexistente}");

        // Assert
        response.EnsureSuccessStatusCode();
        var messages = await response.Content.ReadFromJsonAsync<List<GetMessagesResponse>>();
        Assert.IsNotNull(messages);
        Assert.AreEqual(0, messages.Count, "Esperado lista vazia para bot inexistente.");
    }
    
    [TestMethod]
    public async Task Busca_mensagens_de_bot_sem_mensagens_retorna_lista_vazia()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot sem mensagens",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;

        // Act - Busca mensagens
        var getResponse = await _client.GetAsync($"/api/messages/{botId}");

        // Assert
        getResponse.EnsureSuccessStatusCode();
        var messages = await getResponse.Content.ReadFromJsonAsync<List<GetMessagesResponse>>();
        Assert.IsNotNull(messages);
        Assert.AreEqual(0, messages.Count, "Esperado lista vazia para bot sem mensagens.");
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }
    
    [TestMethod]
    public async Task Envia_multiplas_mensagens_retorna_historico_ordenado()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot múltiplas mensagens",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Arrange - Múltiplas mensagens
        var mensagens = new[]
        {
            "Primeira mensagem",
            "Segunda mensagem",
            "Terceira mensagem"
        };

        // Act - Envio de múltiplas mensagens
        foreach (var mensagemTexto in mensagens)
        {
            var message = new SendMessageRequest { UserMessage = mensagemTexto };
            var response = await _client.PostAsJsonAsync($"/api/messages/{botId}", message);
            response.EnsureSuccessStatusCode();
            
            // Pequena pausa para garantir ordem temporal
            await Task.Delay(100);
        }

        // Act - Busca do histórico
        var getResponse = await _client.GetAsync($"/api/messages/{botId}");

        // Assert
        getResponse.EnsureSuccessStatusCode();
        var historicoMensagens = await getResponse.Content.ReadFromJsonAsync<List<GetMessagesResponse>>();
        Assert.IsNotNull(historicoMensagens);
        Assert.AreEqual(3, historicoMensagens.Count, "Esperado 3 mensagens no histórico.");
        
        // Verifica ordem cronológica
        for (int i = 0; i < mensagens.Length; i++)
        {
            Assert.AreEqual(mensagens[i], historicoMensagens[i].UserMessage, 
                $"Esperado mensagem {i + 1} na posição correta.");
        }
        
        // Verifica que todas têm respostas do bot
        foreach (var msg in historicoMensagens)
        {
            Assert.IsNotNull(msg.BotResponse, "Esperado resposta do bot não ser nula.");
            Assert.IsTrue(msg.BotResponse.Length > 0, "Esperado resposta do bot não ser vazia.");
        }
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }

    [TestMethod]
    public async Task Envia_mensagem_com_conteudo_apenas_espacos_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot teste",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Arrange - Mensagem com apenas espaços
        var newMessage = new SendMessageRequest
        {
            UserMessage = "   "
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botId}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para mensagem com apenas espaços.");
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }

    [TestMethod]
    public async Task Envia_mensagem_nula_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot teste",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Arrange - Mensagem nula
        var newMessage = new SendMessageRequest
        {
            UserMessage = null!
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botId}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para mensagem nula.");
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }

    [TestMethod]
    public async Task Envia_mensagem_com_bot_id_zero_retorna_BadRequest()
    {
        // Arrange
        var botIdZero = 0;
        var newMessage = new SendMessageRequest
        {
            UserMessage = "Mensagem de teste"
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/messages/{botIdZero}", newMessage);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para ID de bot zero.");
    }

    [TestMethod]
    public async Task Verifica_timestamp_das_mensagens_estao_ordenados_cronologicamente()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot timestamp",
            Context = "Você é um bot de teste."
        };

        // Act - Criação do bot
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);
        var botId = createdBot.Id;
        
        // Act - Envio de mensagens com intervalos
        var timestampsEnvio = new List<DateTime>();
        for (int i = 1; i <= 3; i++)
        {
            var message = new SendMessageRequest { UserMessage = $"Mensagem {i}" };
            timestampsEnvio.Add(DateTime.UtcNow);
            var response = await _client.PostAsJsonAsync($"/api/messages/{botId}", message);
            response.EnsureSuccessStatusCode();
            await Task.Delay(200); // Intervalo para garantir timestamps diferentes
        }

        // Act - Busca do histórico
        var getResponse = await _client.GetAsync($"/api/messages/{botId}");

        // Assert
        getResponse.EnsureSuccessStatusCode();
        var mensagens = await getResponse.Content.ReadFromJsonAsync<List<GetMessagesResponse>>();
        Assert.IsNotNull(mensagens);
        Assert.AreEqual(3, mensagens.Count, "Esperado 3 mensagens.");
        
        // Verifica ordenação cronológica dos timestamps
        for (int i = 1; i < mensagens.Count; i++)
        {
            Assert.IsTrue(mensagens[i].Timestamp >= mensagens[i - 1].Timestamp, 
                $"Timestamp da mensagem {i + 1} deve ser posterior ao da mensagem {i}.");
        }
        
        // Act e Assert: Limpeza (Tear Down)
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }

    [ClassCleanup]
    public static void Cleanup()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}