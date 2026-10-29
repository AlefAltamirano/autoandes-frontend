import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout-container">
      <app-header class="header" />
      <app-sidebar class="sidebar" />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout-container {
        display: grid;
        grid-template-areas:
          'header header'
          'sidebar content';
        grid-template-columns: 260px 1fr;
        grid-template-rows: 64px 1fr;
        height: 100vh;
      }
      .header {
        grid-area: header;
        z-index: 10;
      }
      .sidebar {
        grid-area: sidebar;
        border-right: 1px solid #e2e8f0;
        background: #ffffff;
      }
      .content {
        grid-area: content;
        padding: 24px;
        overflow-y: auto;
      }
    `,
  ],
})
export class MainLayoutComponent {}
