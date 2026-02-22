import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../services/product.service';
import { OrderService, OrderSummary } from '../../../services/order.service';
import { UserService, UserDto } from '../../../services/user.service';

export interface KpiCard {
  label:   string;
  value:   string | number;
  icon:    string;
  bg:      string;
  trend:   string;
  trendUp: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading  = true;
  today    = new Date();

  users:    UserDto[]      = [];
  products: Product[]      = [];
  orders:   OrderSummary[] = [];

  kpis: KpiCard[] = [];
  statusData: { label: string; count: number; color: string }[] = [];

  displayedOrderCols   = ['id', 'client', 'date', 'total', 'status'];
  displayedProductCols = ['name', 'price', 'stock', 'status'];

  // circumference of donut circle r=45 → 2*PI*45 ≈ 282.7
  private readonly CIRC = 2 * Math.PI * 45;

  constructor(
    private productSvc: ProductService,
    private orderSvc:   OrderService,
    private userSvc:    UserService
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.productSvc.getAll().toPromise(),
      this.orderSvc.getAllOrders().toPromise(),
      this.userSvc.getAll().toPromise()
    ]).then(([products, orders, users]) => {
      this.products = products ?? [];
      this.orders   = orders   ?? [];
      this.users    = users    ?? [];
      this.buildKpis();
      this.buildCharts();
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  private buildKpis(): void {
    const revenue       = this.orders.reduce((s, o) => s + o.total, 0);
    const clients       = this.users.filter(u => u.role === 'Client').length;
    const lowStock      = this.products.filter(p => p.stock < 5).length;
    const pendingOrders = this.orders.filter(o => o.status === 'Pending').length;

    this.kpis = [
      {
        label: 'Chiffre d\'affaires', value: revenue.toFixed(2) + ' €',
        icon: 'payments', bg: 'linear-gradient(135deg,#667eea,#764ba2)',
        trend: 'revenus totaux', trendUp: true
      },
      {
        label: 'Commandes', value: this.orders.length,
        icon: 'receipt_long', bg: 'linear-gradient(135deg,#f093fb,#f5576c)',
        trend: pendingOrders + ' en attente', trendUp: pendingOrders === 0
      },
      {
        label: 'Clients', value: clients,
        icon: 'group', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)',
        trend: this.users.length + ' utilisateurs', trendUp: true
      },
      {
        label: 'Produits', value: this.products.length,
        icon: 'inventory_2', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)',
        trend: lowStock + ' stock faible', trendUp: lowStock === 0
      }
    ];
  }

  private buildCharts(): void {
    const counts = { Pending: 0, Confirmed: 0, Cancelled: 0 };
    this.orders.forEach(o => { if (o.status in counts) (counts as any)[o.status]++; });
    this.statusData = [
      { label: 'En attente',  count: counts.Pending,   color: '#f59e0b' },
      { label: 'Confirmées',  count: counts.Confirmed, color: '#10b981' },
      { label: 'Annulées',    count: counts.Cancelled, color: '#ef4444' }
    ];
  }

  // ── Donut SVG helpers ────────────────────────────────────────────
  getDonutDash(count: number): string {
    const total = this.orders.length || 1;
    const arc   = (count / total) * this.CIRC;
    return `${arc} ${this.CIRC}`;
  }

  getDonutOffset(index: number): string {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const total = this.orders.length || 1;
      offset += (this.statusData[i].count / total) * this.CIRC;
    }
    // SVG: stroke-dashoffset moves backwards, start at -90° (top)
    return `${-offset}`;
  }

  // ── Other helpers ────────────────────────────────────────────────
  getConfirmedRevenue(): number {
    return this.orders
      .filter(o => o.status === 'Confirmed')
      .reduce((s, o) => s + o.total, 0);
  }

  getStatusColor(s: string): string {
    return ({ Pending: '#f59e0b', Confirmed: '#10b981', Cancelled: '#ef4444' } as any)[s] ?? '#6b7280';
  }

  getStatusLabel(s: string): string {
    return ({ Pending: '⏳ Attente', Confirmed: '✅ Confirmée', Cancelled: '❌ Annulée' } as any)[s] ?? s;
  }

  getStockBadge(stock: number): string {
    if (stock === 0) return 'RUPTURE';
    if (stock < 5)   return 'FAIBLE';
    return 'OK';
  }

  getStockColor(stock: number): string {
    if (stock === 0) return '#ef4444';
    if (stock < 5)   return '#f59e0b';
    return '#10b981';
  }

  getStockBarWidth(stock: number): string {
    const max = Math.max(...this.products.map(p => p.stock), 1);
    return Math.min(Math.round((stock / max) * 100), 100) + '%';
  }

  getBarWidth(count: number): string {
    const max = Math.max(...this.statusData.map(s => s.count), 1);
    return Math.round((count / max) * 100) + '%';
  }

  get recentOrders(): OrderSummary[] { return this.orders.slice(0, 8); }
  get recentUsers(): UserDto[]       { return this.users.slice(0, 6);  }
}
