using ShopAPI.Entities;

namespace ShopAPI.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllWithDetailsAsync();
        Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
        Task<Order?> GetByIdWithDetailsAsync(int orderId);
        Task<Order> CreateFromCartAsync(int userId);
        Task<bool> UpdateStatusAsync(int orderId, string status);
    }
}
