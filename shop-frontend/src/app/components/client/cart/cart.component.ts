import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  displayedColumns = ['product', 'price', 'quantity', 'subtotal', 'actions'];
  loading   = false;
  checkingOut = false;

  constructor(
    private cartSvc:  CartService,
    private orderSvc: OrderService,
    private snack:    MatSnackBar,
    private router:   Router
  ) {}

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.loading = true;
    this.cartSvc.getCart().subscribe({
      next:  items => { this.cartItems = items; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  remove(id: number): void {
    this.cartSvc.removeFromCart(id).subscribe({
      next: () => {
        this.snack.open('Article retiré du panier', 'OK', { duration: 2000 });
        this.loadCart();
      },
      error: () => this.snack.open('Erreur', 'OK', { duration: 2000 })
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  // ── COMMANDER — vide le panier automatiquement ──────────────────
  checkout(): void {
    if (this.cartItems.length === 0) return;
    this.checkingOut = true;

    this.orderSvc.checkout().subscribe({
      next: res => {
        this.checkingOut = false;
        this.cartItems   = []; // vider l'affichage local immédiatement
        this.snack.open(
          `✅ Commande #${res.orderId} passée ! Total : ${res.total.toFixed(2)} €`,
          'Voir mes commandes',
          { duration: 5000 }
        ).onAction().subscribe(() => this.router.navigate(['/shop/orders']));
      },
      error: err => {
        this.checkingOut = false;
        this.snack.open(
          err.error?.message ?? 'Erreur lors de la commande.',
          'OK',
          { duration: 3000 }
        );
      }
    });
  }
}
