using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.DTOs.Users;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly OltpDbContext _ctx;

        public UsersController(OltpDbContext ctx) => _ctx = ctx;

        // GET /api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _ctx.Users
                .AsNoTracking()
                .Select(u => new UserDto(u.Id, u.FirstName, u.LastName, u.Username, u.Role))
                .ToListAsync();

            return Ok(users);
        }
    }
}
