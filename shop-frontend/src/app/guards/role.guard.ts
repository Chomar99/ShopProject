import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth     = inject(AuthService);
  const router   = inject(Router);
  const required = route.data['role'] as string;

  if (auth.getRole() === required) return true;

  // Rediriger vers la page appropriée selon le rôle
  const home = auth.isAdmin() ? '/admin/products' : '/shop/catalog';
  router.navigate([home]);
  return false;
};
