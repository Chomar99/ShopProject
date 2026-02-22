import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id:          number;
  productId:   number;
  productName: string;
  price:       number;
  quantity:    number;
  imageUrl:    string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId, quantity });
  }

  removeFromCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateQuantity(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, quantity);
  }
}
