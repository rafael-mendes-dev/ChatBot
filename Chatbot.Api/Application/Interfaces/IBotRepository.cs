using ChatbotApi.Domain.Entities;

namespace ChatbotApi.Application.Interfaces;

public interface IBotRepository
{
    Task<Bot?> GetByIdAsync(int id);
    Task<IEnumerable<Bot>> GetAllAsync(int pageNumber = 1, int pageSize = 25);
    Task<Bot> CreateAsync(Bot bot);
    Task<Bot> UpdateAsync(Bot bot);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
