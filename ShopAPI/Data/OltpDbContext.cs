using Microsoft.EntityFrameworkCore;
using ShopAPI.Entities;

namespace ShopAPI.Data
{
    public class OltpDbContext : DbContext
    {
        public OltpDbContext(DbContextOptions<OltpDbContext> options) : base(options) { }

        public DbSet<User>      Users      { get; set; }
        public DbSet<Product>   Products   { get; set; }
        public DbSet<CartItem>  CartItems  { get; set; }
        public DbSet<Order>     Orders     { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.User).WithMany(u => u.CartItems)
                .HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CartItem>()
                .HasOne(c => c.Product).WithMany(p => p.CartItems)
                .HasForeignKey(c => c.ProductId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User).WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order).WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product).WithMany()
                .HasForeignKey(oi => oi.ProductId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Order>().Property(o => o.Total).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasPrecision(18, 2);
        }
    }
}
