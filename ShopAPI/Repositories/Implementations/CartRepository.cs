using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;

namespace ShopAPI.Repositories.Implementations
{
    public class CartRepository : ICartRepository
    {
        private readonly OltpDbContext _ctx;

        public CartRepository(OltpDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId)
            => await _ctx.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .AsNoTracking()
                .ToListAsync();

        public async Task<CartItem?> GetItemAsync(int userId, int productId)
            => await _ctx.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        public async Task<CartItem> AddAsync(CartItem item)
        {
            var existing = await GetItemAsync(item.UserId, item.ProductId);
            if (existing is not null)
            {
                existing.Quantity += item.Quantity;
                await _ctx.SaveChangesAsync();
                return existing;
            }

            _ctx.CartItems.Add(item);
            await _ctx.SaveChangesAsync();
            return item;
        }

        public async Task<bool> RemoveAsync(int cartItemId, int userId)
        {
            var item = await _ctx.CartItems
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);
            if (item is null) return false;

            _ctx.CartItems.Remove(item);
            await _ctx.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateQuantityAsync(int cartItemId, int userId, int qty)
        {
            var item = await _ctx.CartItems
                .FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId);
            if (item is null) return false;

            item.Quantity = qty;
            await _ctx.SaveChangesAsync();
            return true;
        }
    }
}
