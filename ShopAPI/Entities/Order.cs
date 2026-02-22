namespace ShopAPI.Entities
{
    public class Order
    {
        public int      Id         { get; set; }
        public int      UserId     { get; set; }
        public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;
        public string   Status     { get; set; } = "Pending"; // Pending | Confirmed | Cancelled
        public decimal  Total      { get; set; }

        public User?               User       { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
