# Clean Architecture - ChatBot API

## Visão Geral

Esta API foi refatorada seguindo os princípios da Clean Architecture, proporcionando uma estrutura mais organizada, testável e mantível.

## Estrutura das Camadas

### 1. Domain Layer
**Localização**: `Domain/`

Contém as entidades de negócio e regras de domínio:

- **Entities/**: Entidades principais (Bot, Message)
- **Exceptions/**: Exceções específicas do domínio

**Características**:
- Não depende de nenhuma outra camada
- Contém apenas lógica de negócio
- Entidades com validações e regras de negócio

### 2. Application Layer
**Localização**: `Application/`

Contém os casos de uso e interfaces:

- **Interfaces/**: Contratos para repositórios e serviços
- **Services/**: Implementação dos casos de uso
- **DTOs/**: Objetos de transferência de dados

**Características**:
- Orquestra as operações de negócio
- Define contratos (interfaces) para infraestrutura
- Não conhece detalhes de implementação externa

### 3. Infrastructure Layer
**Localização**: `Infrastructure/`

Implementações concretas de interfaces externas:

- **Data/**: Contexto do Entity Framework
- **Repositories/**: Implementações dos repositórios
- **Services/**: Implementações de serviços externos (Gemini AI)

**Características**:
- Implementa interfaces definidas na Application Layer
- Gerencia acesso a dados e serviços externos
- Pode ser facilmente substituída por outras implementações

### 4. Presentation Layer
**Localização**: `Presentation/`

Interface com o mundo exterior:

- **Controllers/**: Controllers da API REST
- **Hubs/**: SignalR Hubs para comunicação em tempo real
- **Middleware/**: Middlewares personalizados

**Características**:
- Gerencia requisições HTTP e WebSocket
- Trata exceções e formata respostas
- Não contém lógica de negócio

## Benefícios da Refatoração

### 1. Separação de Responsabilidades
- Cada camada tem uma responsabilidade específica
- Mudanças em uma camada não afetam outras
- Código mais organizado e fácil de entender

### 2. Testabilidade
- Interfaces bem definidas facilitam testes unitários
- Mocking de dependências é mais simples
- Testes de integração mais focados

### 3. Manutenibilidade
- Código mais modular
- Fácil localização de funcionalidades
- Menor acoplamento entre componentes

### 4. Flexibilidade
- Fácil substituição de implementações
- Adição de novos recursos sem afetar código existente
- Suporte a diferentes tipos de interfaces (REST, GraphQL, etc.)

## Fluxo de Dados

```
Request → Presentation → Application → Infrastructure → Database/External APIs
Response ← Presentation ← Application ← Infrastructure ← Database/External APIs
```

## Injeção de Dependências

A configuração de DI está centralizada no `Program.cs`:

```csharp
// Application Layer
builder.Services.AddScoped<IBotService, BotService>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Infrastructure Layer
builder.Services.AddScoped<IBotRepository, BotRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IAiService, GeminiService>();
```

## Tratamento de Exceções

- **Domain Exceptions**: Exceções específicas do domínio
- **Global Exception Handler**: Middleware para tratamento centralizado
- **HTTP Status Codes**: Mapeamento apropriado de exceções para códigos HTTP

## Migrations

As migrations do Entity Framework foram atualizadas para refletir a nova estrutura:

```bash
dotnet ef migrations add AddAuditFields --context ChatbotApi.Infrastructure.Data.AppDbContext
```

## Próximos Passos

1. **Testes Unitários**: Implementar testes para cada camada
2. **Logging**: Adicionar logging estruturado
3. **Validação**: Implementar FluentValidation
4. **Documentação**: Adicionar Swagger/OpenAPI
5. **Monitoramento**: Implementar health checks e métricas
