import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Permiso } from '../auth/auth.model';

export const permisoGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const permisoRequerido = route.data['permiso'] as Permiso;

  if (permisoRequerido && authService.tienePermiso(permisoRequerido)) {
    return true;
  }

  router.navigate(['/acceso-denegado']);
  return false;
};
