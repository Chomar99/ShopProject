using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;

namespace ShopAPI.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly OltpDbContext _ctx;

        public UserRepository(OltpDbContext ctx) => _ctx = ctx;

        public async Task<User?> GetByUsernameAsync(string username)
            => await _ctx.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task<User> CreateAsync(User user)
        {
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UsernameExistsAsync(string username)
            => await _ctx.Users.AnyAsync(u => u.Username == username);
    }
}
