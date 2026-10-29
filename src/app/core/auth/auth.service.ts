import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sesion, LoginRequest, LoginResponse, Permiso } from './auth.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private timer: ReturnType<typeof setTimeout> | undefined;
  private actual = signal<Sesion | null>(this.leer());
  sesionActual = this.actual.asReadonly();
  constructor() {
    if (this.actual()) this.programar();
  }
  private leer(): Sesion | null {
    try {
      const raw = sessionStorage.getItem('autoandes.sesion');
      if (!raw) return null;
      const s: Sesion = JSON.parse(raw);
      if (
        typeof s.token !== 'string' ||
        !Array.isArray(s.permisos) ||
        !Array.isArray(s.roles) ||
        !Number.isFinite(s.expiracion) ||
        s.expiracion <= Date.now()
      ) {
        sessionStorage.removeItem('autoandes.sesion');
        return null;
      }
      return s;
    } catch {
      sessionStorage.removeItem('autoandes.sesion');
      return null;
    }
  }
  private programar() {
    if (this.timer) clearTimeout(this.timer);
    const remaining = (this.actual()?.expiracion ?? 0) - Date.now();
    if (remaining <= 0) {
      this.cerrarSesion(this.router.url, true);
      return;
    }
    this.timer = setTimeout(() => this.cerrarSesion(this.router.url, true), remaining);
  }
  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(environment.apiUrl + '/auth/login', body).pipe(
      tap((r) => {
        const s: Sesion = {
          token: r.token,
          expiracion: Date.now() + r.expiraEnSegundos * 1000,
          nombreCompleto: r.nombreCompleto,
          roles: r.roles,
          permisos: r.permisos,
        };
        sessionStorage.setItem('autoandes.sesion', JSON.stringify(s));
        this.actual.set(s);
        this.programar();
      }),
    );
  }
  cerrarSesion(returnUrl?: string, expirada = false) {
    sessionStorage.removeItem('autoandes.sesion');
    this.actual.set(null);
    if (this.timer) clearTimeout(this.timer);
    this.router.navigate(['/login'], {
      queryParams: { ...(returnUrl ? { returnUrl } : {}), ...(expirada ? { expirada: true } : {}) },
    });
  }
  tienePermiso(p: Permiso) {
    return this.actual()?.permisos.includes(p) ?? false;
  }
  vigente() {
    return !!this.actual() && (this.actual()?.expiracion ?? 0) > Date.now();
  }
}
