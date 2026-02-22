using ShopAPI.DTOs.Auth;
using ShopAPI.Entities;

namespace ShopAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(AuthResponseDto? result, string? error)> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    }

    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
