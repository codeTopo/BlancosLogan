import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../app/Navegation/auth.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Usuario autenticado, permite el acceso
  } else {
    router.navigate(['/home']); // Redirige a /home si no está autenticado
    return false; // Bloquea el acceso
  }
};
