import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html'
})
export class OrderDetailDialogComponent {
  displayedColumns = ['product', 'unitPrice', 'quantity', 'subtotal'];

  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {}

  getStatusColor(status: string): string {
    return { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' }[status] ?? 'gray';
  }
}
