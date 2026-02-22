import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId:   number;
  productName: string;
  unitPrice:   number;
  quantity:    number;
  subtotal:    number;
}

export interface Order {
  id:             number;
  userId:         number;
  clientFullName: string;
  clientUsername: string;
  createdAt:      string;
  status:         string;
  total:          number;
  items:          OrderItem[];
}

export interface OrderSummary {
  id:             number;
  clientFullName: string;
  clientUsername: string;
  createdAt:      string;
  status:         string;
  total:          number;
  itemCount:      number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  // Admin : toutes les commandes
  getAllOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(this.apiUrl);
  }

  // Admin : détail d'une commande
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Admin : mettre à jour le statut
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  // Client : mes commandes
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my`);
  }

  // Client : commander (vide le panier)
  checkout(): Observable<{ message: string; orderId: number; total: number }> {
    return this.http.post<{ message: string; orderId: number; total: number }>(
      `${this.apiUrl}/checkout`, {}
    );
  }
}
