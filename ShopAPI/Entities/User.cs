namespace ShopAPI.Entities
{
    public class User
    {
        public int    Id           { get; set; }
        public string FirstName    { get; set; } = string.Empty;   // NOUVEAU
        public string LastName     { get; set; } = string.Empty;   // NOUVEAU
        public string Username     { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role         { get; set; } = "Client"; // "Admin" | "Client"

        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public ICollection<Order>    Orders    { get; set; } = new List<Order>(); // NOUVEAU
    }
}
