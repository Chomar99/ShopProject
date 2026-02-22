namespace ShopAPI.DTOs.Orders
{
    public record OrderItemDto(
        int     ProductId,
        string  ProductName,
        decimal UnitPrice,
        int     Quantity,
        decimal Subtotal
    );

    public record OrderDto(
        int               Id,
        int               UserId,
        string            ClientFullName,
        string            ClientUsername,
        DateTime          CreatedAt,
        string            Status,
        decimal           Total,
        List<OrderItemDto> Items
    );

    public record OrderSummaryDto(
        int      Id,
        string   ClientFullName,
        string   ClientUsername,
        DateTime CreatedAt,
        string   Status,
        decimal  Total,
        int      ItemCount
    );

    public record UpdateOrderStatusDto(string Status);
}
