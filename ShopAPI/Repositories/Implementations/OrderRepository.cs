using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;

namespace ShopAPI.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OltpDbContext _ctx;

        public OrderRepository(OltpDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<Order>> GetAllWithDetailsAsync()
            => await _ctx.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .AsNoTracking()
                .ToListAsync();

        public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
            => await _ctx.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .AsNoTracking()
                .ToListAsync();

        public async Task<Order?> GetByIdWithDetailsAsync(int orderId)
            => await _ctx.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

        /// <summary>
        /// Crée une commande à partir du panier du client,
        /// puis vide le panier si la commande est créée avec succès.
        /// </summary>
        public async Task<Order> CreateFromCartAsync(int userId)
        {
            // 1. Récupérer le panier avec les produits
            var cartItems = await _ctx.CartItems
                .Include(c => c.Product)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                throw new InvalidOperationException("Le panier est vide.");

            // 2. Construire la commande
            var order = new Order
            {
                UserId    = userId,
                CreatedAt = DateTime.UtcNow,
                Status    = "Pending",
                Total     = cartItems.Sum(c => c.Product!.Price * c.Quantity),
                OrderItems = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity  = c.Quantity,
                    UnitPrice = c.Product!.Price
                }).ToList()
            };

            _ctx.Orders.Add(order);

            // 3. Vider le panier
            _ctx.CartItems.RemoveRange(cartItems);

            await _ctx.SaveChangesAsync();
            return order;
        }

        public async Task<bool> UpdateStatusAsync(int orderId, string status)
        {
            var order = await _ctx.Orders.FindAsync(orderId);
            if (order is null) return false;

            order.Status = status;
            await _ctx.SaveChangesAsync();
            return true;
        }
    }
}
