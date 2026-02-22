import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, OrderSummary, Order } from '../../../services/order.service';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderSummary[] = [];
  displayedColumns = ['id', 'client', 'date', 'items', 'total', 'status', 'actions'];
  loading = false;

  statuses = ['Pending', 'Confirmed', 'Cancelled'];

  constructor(
    private orderSvc: OrderService,
    private dialog:   MatDialog,
    private snack:    MatSnackBar
  ) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.loading = true;
    this.orderSvc.getAllOrders().subscribe({
      next:  o => { this.orders = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openDetail(id: number): void {
    this.orderSvc.getOrderById(id).subscribe(order => {
      this.dialog.open(OrderDetailDialogComponent, {
        width: '650px',
        data: order
      });
    });
  }

  changeStatus(orderId: number, status: string): void {
    this.orderSvc.updateStatus(orderId, status).subscribe({
      next: () => {
        this.snack.open(`Statut mis à jour : ${status}`, 'OK', { duration: 3000 });
        this.loadOrders();
      },
      error: () => this.snack.open('Erreur mise à jour statut', 'OK', { duration: 3000 })
    });
  }

  getStatusColor(status: string): string {
    return { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' }[status] ?? 'gray';
  }

  getStatusLabel(status: string): string {
    return { Pending: '⏳ En attente', Confirmed: '✅ Confirmée', Cancelled: '❌ Annulée' }[status] ?? status;
  }
}
