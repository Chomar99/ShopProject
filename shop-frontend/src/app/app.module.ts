import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

// Pipes
import { DatePipe, CurrencyPipe } from '@angular/common';

// Routing & Interceptor
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// Components
import { AppComponent }              from './app.component';
import { NavbarComponent }           from './components/shared/navbar/navbar.component';
import { LoginComponent }            from './components/auth/login/login.component';
import { RegisterComponent }         from './components/auth/register/register.component';
import { ProductListComponent }      from './components/admin/product-list/product-list.component';
import { ProductFormComponent }      from './components/admin/product-form/product-form.component';
import { OrderListComponent }        from './components/admin/order-list/order-list.component';
import { OrderDetailDialogComponent} from './components/admin/order-detail-dialog/order-detail-dialog.component';
import { DashboardComponent }        from './components/admin/dashboard/dashboard.component'; // NOUVEAU
import { ProductCatalogComponent }   from './components/client/product-catalog/product-catalog.component';
import { CartComponent }             from './components/client/cart/cart.component';
import { MyOrdersComponent }         from './components/client/my-orders/my-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductFormComponent,
    OrderListComponent,
    OrderDetailDialogComponent,
    DashboardComponent,          // NOUVEAU
    ProductCatalogComponent,
    CartComponent,
    MyOrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule, MatSidenavModule, MatTableModule,
    MatCardModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatSnackBarModule,
    MatDialogModule, MatBadgeModule, MatMenuModule,
    MatProgressSpinnerModule, MatTooltipModule, MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe, CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
