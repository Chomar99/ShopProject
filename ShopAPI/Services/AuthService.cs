using ShopAPI.DTOs.Auth;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;
using ShopAPI.Services.Interfaces;

namespace ShopAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService   _tokenSvc;

        public AuthService(IUserRepository userRepo, ITokenService tokenSvc)
        {
            _userRepo = userRepo;
            _tokenSvc = tokenSvc;
        }

        public async Task<(AuthResponseDto? result, string? error)> RegisterAsync(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return (null, "Les mots de passe ne correspondent pas.");

            if (await _userRepo.UsernameExistsAsync(dto.Username))
                return (null, "Ce nom d'utilisateur est déjà pris.");

            var user = new User
            {
                FirstName    = dto.FirstName,
                LastName     = dto.LastName,
                Username     = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role         = "Client"
            };

            await _userRepo.CreateAsync(user);
            var token    = _tokenSvc.GenerateToken(user);
            var fullName = $"{user.FirstName} {user.LastName}";
            return (new AuthResponseDto(token, user.Role, user.Username, fullName), null);
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByUsernameAsync(dto.Username);
            if (user is null) return null;
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

            var token    = _tokenSvc.GenerateToken(user);
            var fullName = $"{user.FirstName} {user.LastName}";
            return new AuthResponseDto(token, user.Role, user.Username, fullName);
        }
    }
}
