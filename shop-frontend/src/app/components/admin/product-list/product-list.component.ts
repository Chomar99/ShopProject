import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns = ['image', 'name', 'description', 'price', 'stock', 'actions'];
  loading = false;

  constructor(
    private productSvc: ProductService,
    private dialog:     MatDialog,
    private snack:      MatSnackBar
  ) {}

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getAll().subscribe({
      next:  p => { this.products = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(product?: Product): void {
    const ref = this.dialog.open(ProductFormComponent, {
      width: '520px',
      data: product ?? null
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadProducts();
    });
  }

  delete(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    this.productSvc.delete(id).subscribe({
      next: () => {
        this.snack.open('Produit supprimé avec succès', 'OK', { duration: 3000 });
        this.loadProducts();
      },
      error: () => this.snack.open('Erreur lors de la suppression', 'OK', { duration: 3000 })
    });
  }
}
