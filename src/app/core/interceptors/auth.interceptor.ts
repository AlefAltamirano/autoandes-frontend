import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sesion = authService.sesionActual();
  
  if (req.url.startsWith(environment.apiUrl + "/") && sesion) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${sesion.token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};
