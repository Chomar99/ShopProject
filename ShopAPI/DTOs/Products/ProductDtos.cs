namespace ShopAPI.DTOs.Products
{
    public record ProductDto(
        int     Id,
        string  Name,
        string  Description,
        decimal Price,
        int     Stock,
        string  ImageUrl
    );

    public record CreateProductDto(
        string  Name,
        string  Description,
        decimal Price,
        int     Stock,
        string  ImageUrl
    );

    public record UpdateProductDto(
        string  Name,
        string  Description,
        decimal Price,
        int     Stock,
        string  ImageUrl
    );
}
