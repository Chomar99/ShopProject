using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.DTOs.Cart;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;
using System.Security.Claims;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Client")]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepo;

        public CartController(ICartRepository cartRepo) => _cartRepo = cartRepo;

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET /api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var items = await _cartRepo.GetByUserIdAsync(GetUserId());
            var dtos = items.Select(i => new CartItemDto(
                i.Id, i.ProductId, i.Product!.Name,
                i.Product.Price, i.Quantity, i.Product.ImageUrl));
            return Ok(dtos);
        }

        // POST /api/cart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            if (dto.Quantity <= 0)
                return BadRequest(new { message = "La quantité doit être supérieure à 0." });

            var item = new CartItem
            {
                UserId    = GetUserId(),
                ProductId = dto.ProductId,
                Quantity  = dto.Quantity
            };

            var created = await _cartRepo.AddAsync(item);
            return Ok(new { message = "Produit ajouté au panier.", cartItemId = created.Id });
        }

        // DELETE /api/cart/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var removed = await _cartRepo.RemoveAsync(id, GetUserId());
            if (!removed)
                return NotFound(new { message = "Article introuvable dans votre panier." });

            return NoContent();
        }

        // PUT /api/cart/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] int quantity)
        {
            if (quantity <= 0)
                return BadRequest(new { message = "La quantité doit être supérieure à 0." });

            var updated = await _cartRepo.UpdateQuantityAsync(id, GetUserId(), quantity);
            if (!updated)
                return NotFound(new { message = "Article introuvable dans votre panier." });

            return Ok(new { message = "Quantité mise à jour." });
        }
    }
}
