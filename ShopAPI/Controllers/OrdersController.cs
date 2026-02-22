using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.DTOs.Orders;
using ShopAPI.Repositories.Interfaces;
using System.Security.Claims;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepo;

        public OrdersController(IOrderRepository orderRepo) => _orderRepo = orderRepo;

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // ── ADMIN ────────────────────────────────────────────────────────────

        /// <summary>GET /api/orders — Toutes les commandes (Admin)</summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderRepo.GetAllWithDetailsAsync();
            var result = orders.Select(o => new OrderSummaryDto(
                o.Id,
                $"{o.User?.FirstName} {o.User?.LastName}".Trim(),
                o.User?.Username ?? "",
                o.CreatedAt,
                o.Status,
                o.Total,
                o.OrderItems.Sum(oi => oi.Quantity)
            ));
            return Ok(result);
        }

        /// <summary>GET /api/orders/{id} — Détail d'une commande (Admin)</summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderRepo.GetByIdWithDetailsAsync(id);
            if (order is null) return NotFound(new { message = "Commande introuvable." });

            return Ok(MapToDto(order));
        }

        /// <summary>PUT /api/orders/{id}/status — Changer le statut (Admin)</summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var allowed = new[] { "Pending", "Confirmed", "Cancelled" };
            if (!allowed.Contains(dto.Status))
                return BadRequest(new { message = "Statut invalide. Valeurs : Pending, Confirmed, Cancelled" });

            var updated = await _orderRepo.UpdateStatusAsync(id, dto.Status);
            if (!updated) return NotFound(new { message = "Commande introuvable." });

            return Ok(new { message = $"Statut mis à jour : {dto.Status}" });
        }

        // ── CLIENT ───────────────────────────────────────────────────────────

        /// <summary>GET /api/orders/my — Mes commandes (Client)</summary>
        [HttpGet("my")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyOrders()
        {
            var orders = await _orderRepo.GetByUserIdAsync(GetUserId());
            var result = orders.Select(MapToDto);
            return Ok(result);
        }

        /// <summary>POST /api/orders/checkout — Commander (panier → commande, vide le panier)</summary>
        [HttpPost("checkout")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                var order = await _orderRepo.CreateFromCartAsync(GetUserId());
                return Ok(new
                {
                    message = "Commande passée avec succès ! Votre panier a été vidé.",
                    orderId = order.Id,
                    total   = order.Total
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ── Helper ───────────────────────────────────────────────────────────

        private static OrderDto MapToDto(Entities.Order o) => new(
            o.Id,
            o.UserId,
            $"{o.User?.FirstName} {o.User?.LastName}".Trim(),
            o.User?.Username ?? "",
            o.CreatedAt,
            o.Status,
            o.Total,
            o.OrderItems.Select(oi => new OrderItemDto(
                oi.ProductId,
                oi.Product?.Name ?? "",
                oi.UnitPrice,
                oi.Quantity,
                oi.UnitPrice * oi.Quantity
            )).ToList()
        );
    }
}
