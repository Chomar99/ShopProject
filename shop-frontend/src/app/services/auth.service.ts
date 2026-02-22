import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token:    string;
  role:     string;
  username: string;
  fullName: string; // NOUVEAU
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    confirmPassword: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`,
        { firstName, lastName, username, password, confirmPassword })
      .pipe(tap(res => this.storeAuth(res)));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(res => this.storeAuth(res)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    this.router.navigate(['/login']);
  }

  private storeAuth(res: AuthResponse): void {
    localStorage.setItem('token',    res.token);
    localStorage.setItem('role',     res.role);
    localStorage.setItem('username', res.username);
    localStorage.setItem('fullName', res.fullName);
  }

  getToken(): string | null    { return localStorage.getItem('token'); }
  getRole(): string | null     { return localStorage.getItem('role'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  getFullName(): string | null { return localStorage.getItem('fullName'); }
  isLoggedIn(): boolean        { return !!this.getToken(); }
  isAdmin(): boolean           { return this.getRole() === 'Admin'; }
  isClient(): boolean          { return this.getRole() === 'Client'; }
}
