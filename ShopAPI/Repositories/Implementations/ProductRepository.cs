using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;

namespace ShopAPI.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly OltpDbContext _ctx;

        public ProductRepository(OltpDbContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<Product>> GetAllAsync()
            => await _ctx.Products.AsNoTracking().ToListAsync();

        public async Task<Product?> GetByIdAsync(int id)
            => await _ctx.Products.FindAsync(id);

        public async Task<Product> CreateAsync(Product product)
        {
            _ctx.Products.Add(product);
            await _ctx.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(int id, Product updated)
        {
            var existing = await _ctx.Products.FindAsync(id);
            if (existing is null) return null;

            existing.Name        = updated.Name;
            existing.Description = updated.Description;
            existing.Price       = updated.Price;
            existing.Stock       = updated.Stock;
            existing.ImageUrl    = updated.ImageUrl;

            await _ctx.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _ctx.Products.FindAsync(id);
            if (product is null) return false;

            _ctx.Products.Remove(product);
            await _ctx.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
            => await _ctx.Products.AnyAsync(p => p.Id == id);
    }
}
