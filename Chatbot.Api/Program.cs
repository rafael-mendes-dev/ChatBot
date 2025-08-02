using System.Threading.RateLimiting;
using ChatbotApi.Data;
using ChatbotApi.Hubs;
using ChatbotApi.Services;
using ChatbotApi.Util;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuraçao para utilizar o SQL Server
builder.Services.AddDbContext<AppDbContext>(op =>
    op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

#region Configuração do CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        bd => bd.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

#endregion

#region Configuração de Rate Limiting

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

#endregion

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddScoped<IGeminiService, GeminiService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");
app.UseRateLimiter();
app.UseAuthorization();
app.MapHub<ChatHub>("/chatHub");
app.MapControllers();

app.Run();

public partial class Program{}