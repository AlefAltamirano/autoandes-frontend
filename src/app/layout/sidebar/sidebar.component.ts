import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MENU } from '../../core/config/menu';
import { SiPermisoDirective } from '../../shared/directives/si-permiso.directive';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SiPermisoDirective],
  template: `
    <nav class="sidebar-nav">
      <ul>
        @for (item of filteredMenu(); track item.route) {
          <li *appSiPermiso="item.permiso">
            <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar-nav { padding: 24px 16px; }
    .sidebar-nav ul { list-style: none; padding: 0; }
    .nav-link { 
      display: block; 
      padding: 12px 16px; 
      color: #475569; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 500;
      transition: all 0.2s;
    }
    .nav-link:hover { background-color: #f1f5f9; color: #0f172a; }
    .nav-link.active { background-color: #dbeafe; color: #2563eb; }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  filteredMenu = computed(() => {
    return MENU.filter(item => this.authService.tienePermiso(item.permiso));
  });
}
