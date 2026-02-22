namespace ShopAPI.DTOs.Auth
{
    public record RegisterDto(
        string FirstName,
        string LastName,
        string Username,
        string Password,
        string ConfirmPassword
    );

    public record LoginDto(string Username, string Password);

    public record AuthResponseDto(string Token, string Role, string Username, string FullName);
}
