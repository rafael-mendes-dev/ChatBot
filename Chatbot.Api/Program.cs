using System.Threading.RateLimiting;
using ChatbotApi.Application.Interfaces;
using ChatbotApi.Application.Services;
using ChatbotApi.Infrastructure.Data;
using ChatbotApi.Infrastructure.Repositories;
using ChatbotApi.Infrastructure.Services;
using ChatbotApi.Presentation.Controllers;
using ChatbotApi.Presentation.Hubs;
using ChatbotApi.Presentation.Middleware;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuração do banco de dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Configuração de Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "fixed", limiterOptions =>
    {
        limiterOptions.PermitLimit = 100;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 5;
    });
                
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Configuração dos serviços da aplicação
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Injeção de dependências - Application Layer
builder.Services.AddScoped<IBotService, BotService>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Injeção de dependências - Infrastructure Layer
builder.Services.AddScoped<IBotRepository, BotRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IAiService, GeminiService>();

var app = builder.Build();

// Configuração do pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseRateLimiter();

// Middleware de tratamento global de exceções
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

app.UseAuthorization();
app.MapHub<ChatHub>("/chatHub");
app.MapControllers();

app.Run();

public partial class Program { }