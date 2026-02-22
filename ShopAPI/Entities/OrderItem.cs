namespace ShopAPI.Entities
{
    public class OrderItem
    {
        public int     Id        { get; set; }
        public int     OrderId   { get; set; }
        public int     ProductId { get; set; }
        public int     Quantity  { get; set; }
        public decimal UnitPrice { get; set; } // prix au moment de la commande

        public Order?   Order   { get; set; }
        public Product? Product { get; set; }
    }
}
