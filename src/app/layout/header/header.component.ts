import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header-content">
      <div class="brand">
        <h2>AutoAndes</h2>
      </div>
      @if (sesion(); as s) {
        <div class="user-info">
          <div class="user-details">
            <span class="user-name">{{ s.nombreCompleto }}</span>
            <div class="roles">
              @for (rol of s.roles; track rol) {
                <span class="badge badge-role">{{ rol }}</span>
              }
            </div>
          </div>
          <button class="btn btn-danger" (click)="authService.cerrarSesion()">Salir</button>
        </div>
      }
    </header>
  `,
  styles: [`
    .header-content {
      background-color: #0f172a;
      color: white;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    .brand h2 { font-size: 1.25rem; font-weight: 700; color: #60a5fa; }
    .user-info { display: flex; align-items: center; gap: 16px; }
    .user-details { text-align: right; }
    .user-name { display: block; font-size: 0.875rem; font-weight: 500; }
    .roles { display: flex; gap: 4px; justify-content: flex-end; }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  sesion = this.authService.sesionActual;
}
