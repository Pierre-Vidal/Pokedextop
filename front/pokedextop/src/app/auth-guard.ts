import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // ✅ 1. Routes publiques autorisées même sans login
  const publicRoutes = ['list-pokemon', 'pokemon'];

  // Si la route actuelle est dans la liste des routes publiques → on laisse passer
  if (publicRoutes.includes(route.routeConfig?.path ?? '')) {
    return true;
  }

  // ✅ 2. Toutes les autres routes nécessitent une authentification
  if (authService.isAuthenticated()) {
    return true;
  }

  // Sinon → redirection vers login
  router.navigate(['/login']);
  return false;
};
