using System.Net;
using System.Net.Http.Json;
using ChatbotApi.Models;
using Microsoft.AspNetCore.Mvc.Testing;

namespace ChatbotTests.BotsControllerTests;

[TestClass]
public class BotsControllerTests
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
    public async Task Cria_bot_e_busca_pelo_seu_id_retorna_Ok_e_valor_nao_nulo()
    {
        // Arrange
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

        // Arrange - Prepara para a busca, usando o ID do bot criado
        var botId = createdBot.Id;

        // Act - Busca do bot pelo ID
        var getResponse = await _client.GetAsync($"/api/bots/{botId}");

        // Assert - Verificação da busca
        getResponse.EnsureSuccessStatusCode();
        var fetchedBot = await getResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(fetchedBot);
        Assert.AreEqual(botId, fetchedBot.Id, "Esperado id do bot ser igual ao id do bot criado.");
        Assert.AreEqual(newBot.Name, fetchedBot.Name, "Esperado nome do bot ser igual ao nome do bot criado.");
        
        // Act e Assert: Limpeza (Tear Down)
        // Exclui o bot para garantir que o ambiente fique limpo para o próximo teste
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }
    
    [TestMethod]
    public async Task Busca_bots_retorna_Ok()
    {
        // Act - Busca todos os bots
        var response = await _client.GetAsync("/api/bots");
        
        // Assert - Verificação da busca
        response.EnsureSuccessStatusCode();
        var bots = await response.Content.ReadFromJsonAsync<List<Bot>>();
        Assert.IsNotNull(bots);
    }
    
    [TestMethod]
    public async Task Cria_bot_e_atualiza_com_sucesso()
    {
        // Arrange: Cria um bot que será atualizado
        var newBot = new Bot { Name = "Bot Antigo", Context = "Contexto antigo." };
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);

        // Arrange: Prepara os dados para a atualização
        var botId = createdBot.Id;
        var updatedBot = new Bot { 
            Id = botId,
            Name = "Bot Atualizado", 
            Context = "Novo contexto." 
        };

        // Act: Envia a requisição de atualização (PUT)
        var updateResponse = await _client.PutAsJsonAsync($"/api/bots/{botId}", updatedBot);

        // Assert: Verifica se a atualização foi bem-sucedida
        updateResponse.EnsureSuccessStatusCode();

        // Act: Busca o bot novamente para validar as mudanças
        var getResponse = await _client.GetAsync($"/api/bots/{botId}");
        getResponse.EnsureSuccessStatusCode();
        var fetchedBot = await getResponse.Content.ReadFromJsonAsync<Bot>();

        // Assert: Garante que os dados foram realmente atualizados
        Assert.IsNotNull(fetchedBot);
        Assert.AreEqual(updatedBot.Name, fetchedBot.Name, "O nome do bot deve ter sido atualizado.");
        Assert.AreEqual(updatedBot.Context, fetchedBot.Context, "O contexto do bot deve ter sido atualizado.");
        
        // Act e Assert: Limpeza (Tear Down)
        // Exclui o bot para garantir que o ambiente fique limpo para o próximo teste
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
        deleteResponse.EnsureSuccessStatusCode();
    }
    
    [TestMethod]
    public async Task Cria_bot_exclui_bot_com_sucesso()
    {
        // Arrange: Cria um bot que será excluído
        var newBot = new Bot { Name = "Bot para Excluir", Context = "Contexto qualquer." };
        var createResponse = await _client.PostAsJsonAsync("/api/bots", newBot);
        createResponse.EnsureSuccessStatusCode();
        var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
        Assert.IsNotNull(createdBot);

        // Act: Envia a requisição de exclusão (DELETE)
        var botId = createdBot.Id;
        var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");

        // Assert: Verifica se a exclusão retornou um status de sucesso (204 No Content)
        deleteResponse.EnsureSuccessStatusCode();

        // Act: Tenta buscar o bot excluído
        var getResponse = await _client.GetAsync($"/api/bots/{botId}");

        // Assert: Garante que a busca retornou um status 404 Not Found
        Assert.AreEqual(HttpStatusCode.NotFound, getResponse.StatusCode, "A busca pelo bot excluído deve retornar 404.");
    }

    [TestMethod]
    public async Task Cria_bot_com_nome_vazio_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "",
            Context = "Contexto válido"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/bots", newBot);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para nome vazio.");
    }

    [TestMethod]
    public async Task Cria_bot_com_contexto_vazio_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "Bot válido",
            Context = ""
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/bots", newBot);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para contexto vazio.");
    }

    [TestMethod]
    public async Task Cria_bot_com_nome_apenas_espacos_retorna_BadRequest()
    {
        // Arrange
        var newBot = new Bot
        {
            Name = "   ",
            Context = "Contexto válido"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/bots", newBot);

        // Assert
        Assert.AreEqual(HttpStatusCode.BadRequest, response.StatusCode, "Esperado status 400 para nome com apenas espaços.");
    }

    [TestMethod]
    public async Task Atualiza_bot_inexistente_retorna_NotFound()
    {
        // Arrange
        var botIdInexistente = 99999;
        var updatedBot = new Bot
        {
            Id = botIdInexistente,
            Name = "Bot Inexistente",
            Context = "Contexto qualquer"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/bots/{botIdInexistente}", updatedBot);

        // Assert
        Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode, "Esperado status 404 para bot inexistente.");
    }

    [TestMethod]
    public async Task Exclui_bot_inexistente_retorna_NotFound()
    {
        // Arrange
        var botIdInexistente = 99999;

        // Act
        var response = await _client.DeleteAsync($"/api/bots/{botIdInexistente}");

        // Assert
        Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode, "Esperado status 404 para bot inexistente.");
    }

    [TestMethod]
    public async Task Busca_bot_inexistente_retorna_NotFound()
    {
        // Arrange
        var botIdInexistente = 99999;

        // Act
        var response = await _client.GetAsync($"/api/bots/{botIdInexistente}");

        // Assert
        Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode, "Esperado status 404 para bot inexistente.");
    }

    [TestMethod]
    public async Task Busca_bots_com_paginacao_retorna_lista_limitada()
    {
        // Arrange - Criar alguns bots para teste
        var botsParaTeste = new List<int>();
        for (int i = 1; i <= 3; i++)
        {
            var bot = new Bot { Name = $"Bot Paginação {i}", Context = $"Contexto {i}" };
            var createResponse = await _client.PostAsJsonAsync("/api/bots", bot);
            createResponse.EnsureSuccessStatusCode();
            var createdBot = await createResponse.Content.ReadFromJsonAsync<Bot>();
            Assert.IsNotNull(createdBot);
            botsParaTeste.Add(createdBot.Id);
        }

        // Act - Buscar com paginação (página 1, tamanho 2)
        var response = await _client.GetAsync("/api/bots?pageNumber=1&pageSize=2");

        // Assert
        response.EnsureSuccessStatusCode();
        var bots = await response.Content.ReadFromJsonAsync<List<Bot>>();
        Assert.IsNotNull(bots);
        Assert.IsTrue(bots.Count <= 2, "Esperado no máximo 2 bots por página.");

        // Act e Assert: Limpeza (Tear Down)
        foreach (var botId in botsParaTeste)
        {
            var deleteResponse = await _client.DeleteAsync($"/api/bots/{botId}");
            deleteResponse.EnsureSuccessStatusCode();
        }
    }

    [ClassCleanup]
    public static void Cleanup()
    {
        _client?.Dispose();
        _factory?.Dispose();
    }
}