namespace ShopAPI.DTOs.Cart
{
    public record CartItemDto(
        int     Id,
        int     ProductId,
        string  ProductName,
        decimal Price,
        int     Quantity,
        string  ImageUrl
    );

    public record AddToCartDto(int ProductId, int Quantity);
}
