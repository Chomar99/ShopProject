using ShopAPI.Entities;

namespace ShopAPI.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId);
        Task<CartItem?> GetItemAsync(int userId, int productId);
        Task<CartItem> AddAsync(CartItem item);
        Task<bool> RemoveAsync(int cartItemId, int userId);
        Task<bool> UpdateQuantityAsync(int cartItemId, int userId, int qty);
    }
}
