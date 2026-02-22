using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.DTOs.Products;
using ShopAPI.Entities;
using ShopAPI.Repositories.Interfaces;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repo;

        public ProductsController(IProductRepository repo) => _repo = repo;

        // GET /api/products — Admin + Client
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var products = await _repo.GetAllAsync();
            var dtos = products.Select(p => new ProductDto(
                p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl));
            return Ok(dtos);
        }

        // GET /api/products/{id} — Admin + Client
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var p = await _repo.GetByIdAsync(id);
            if (p is null)
                return NotFound(new { message = $"Produit avec l'id {id} introuvable." });

            return Ok(new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Stock, p.ImageUrl));
        }

        // POST /api/products — Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = new Product
            {
                Name        = dto.Name,
                Description = dto.Description,
                Price       = dto.Price,
                Stock       = dto.Stock,
                ImageUrl    = dto.ImageUrl
            };

            var created = await _repo.CreateAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new ProductDto(created.Id, created.Name, created.Description,
                               created.Price, created.Stock, created.ImageUrl));
        }

        // PUT /api/products/{id} — Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = new Product
            {
                Name        = dto.Name,
                Description = dto.Description,
                Price       = dto.Price,
                Stock       = dto.Stock,
                ImageUrl    = dto.ImageUrl
            };

            var result = await _repo.UpdateAsync(id, updated);
            if (result is null)
                return NotFound(new { message = $"Produit avec l'id {id} introuvable." });

            return Ok(new ProductDto(result.Id, result.Name, result.Description,
                                     result.Price, result.Stock, result.ImageUrl));
        }

        // DELETE /api/products/{id} — Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Produit avec l'id {id} introuvable." });

            return NoContent();
        }
    }
}
