import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  expandedOrderId: number | null = null;

  constructor(private orderSvc: OrderService) {}

  ngOnInit(): void {
    this.loading = true;
    this.orderSvc.getMyOrders().subscribe({
      next:  o => { this.orders = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggle(id: number): void {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }

  getStatusColor(status: string): string {
    return { Pending: 'orange', Confirmed: 'green', Cancelled: 'red' }[status] ?? 'gray';
  }

  getStatusLabel(status: string): string {
    return { Pending: '⏳ En attente', Confirmed: '✅ Confirmée', Cancelled: '❌ Annulée' }[status] ?? status;
  }
}
