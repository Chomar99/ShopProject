import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(
    private productSvc: ProductService,
    private cartSvc:    CartService,
    private snack:      MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productSvc.getAll().subscribe({
      next:  p => { this.products = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  addToCart(product: Product): void {
    this.cartSvc.addToCart(product.id, 1).subscribe({
      next: () => this.snack.open(`"${product.name}" ajouté au panier !`, 'Voir le panier', {
        duration: 3000
      }),
      error: () => this.snack.open('Erreur lors de l\'ajout au panier', 'OK', { duration: 3000 })
    });
  }
}
