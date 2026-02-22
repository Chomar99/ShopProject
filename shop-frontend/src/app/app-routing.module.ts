import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { LoginComponent }            from './components/auth/login/login.component';
import { RegisterComponent }         from './components/auth/register/register.component';
import { DashboardComponent }        from './components/admin/dashboard/dashboard.component';
import { ProductListComponent }      from './components/admin/product-list/product-list.component';
import { OrderListComponent }        from './components/admin/order-list/order-list.component';
import { ProductCatalogComponent }   from './components/client/product-catalog/product-catalog.component';
import { CartComponent }             from './components/client/cart/cart.component';
import { MyOrdersComponent }         from './components/client/my-orders/my-orders.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ── Admin routes ─────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    children: [
      { path: '',         redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },  // NOUVEAU
      { path: 'products',  component: ProductListComponent },
      { path: 'orders',    component: OrderListComponent }
    ]
  },

  // ── Client routes ────────────────────────────────────────────
  {
    path: 'shop',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Client' },
    children: [
      { path: '',        redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', component: ProductCatalogComponent },
      { path: 'cart',    component: CartComponent },
      { path: 'orders',  component: MyOrdersComponent }
    ]
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
