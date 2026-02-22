import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    private fb:         FormBuilder,
    private productSvc: ProductService,
    private snack:      MatSnackBar,
    private dialogRef:  MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = this.fb.group({
      name:        [this.data?.name        ?? '', [Validators.required]],
      description: [this.data?.description ?? '', [Validators.required]],
      price:       [this.data?.price       ?? 0,  [Validators.required, Validators.min(0)]],
      stock:       [this.data?.stock       ?? 0,  [Validators.required, Validators.min(0)]],
      imageUrl:    [this.data?.imageUrl    ?? '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const payload = this.form.value;

    const action$ = this.isEdit
      ? this.productSvc.update(this.data!.id, payload)
      : this.productSvc.create(payload);

    action$.subscribe({
      next: () => {
        this.loading = false;
        const msg = this.isEdit ? 'Produit modifié !' : 'Produit créé !';
        this.snack.open(msg, 'OK', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.snack.open('Une erreur est survenue.', 'OK', { duration: 3000 });
      }
    });
  }
}
