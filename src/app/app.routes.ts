import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { invitadoGuard } from './core/guards/invitado.guard';
import { permisoGuard } from './core/guards/permiso.guard';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [invitadoGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'servicios' },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./features/servicios/servicio-list.component').then(
            (m) => m.ServicioListComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'SERVICIO_LEER' },
      },
      {
        path: 'servicios/nuevo',
        loadComponent: () =>
          import('./features/servicios/servicio-form.component').then(
            (m) => m.ServicioFormComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'SERVICIO_ESCRIBIR' },
      },
      {
        path: 'servicios/:id/editar',
        loadComponent: () =>
          import('./features/servicios/servicio-form.component').then(
            (m) => m.ServicioFormComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'SERVICIO_ESCRIBIR' },
      },
      {
        path: 'vehiculos',
        loadComponent: () =>
          import('./features/vehiculos/vehiculo-list.component').then(
            (m) => m.VehiculoListComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'VEHICULO_LEER' },
      },
      {
        path: 'vehiculos/nuevo',
        loadComponent: () =>
          import('./features/vehiculos/vehiculo-form.component').then(
            (m) => m.VehiculoFormComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'VEHICULO_ESCRIBIR' },
      },
      {
        path: 'vehiculos/:id/editar',
        loadComponent: () =>
          import('./features/vehiculos/vehiculo-form.component').then(
            (m) => m.VehiculoFormComponent,
          ),
        canActivate: [permisoGuard],
        data: { permiso: 'VEHICULO_ESCRIBIR' },
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./features/ordenes/orden-list.component').then((m) => m.OrdenListComponent),
        canActivate: [permisoGuard],
        data: { permiso: 'ORDEN_LEER' },
      },
      {
        path: 'ordenes/nueva',
        loadComponent: () =>
          import('./features/ordenes/orden-form.component').then((m) => m.OrdenFormComponent),
        canActivate: [permisoGuard],
        data: { permiso: 'ORDEN_REGISTRAR' },
      },
      {
        path: 'ordenes/:id',
        loadComponent: () =>
          import('./features/ordenes/orden-detail.component').then((m) => m.OrdenDetailComponent),
        canActivate: [permisoGuard],
        data: { permiso: 'ORDEN_LEER' },
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/reporte.component').then((m) => m.ReporteComponent),
        canActivate: [permisoGuard],
        data: { permiso: 'REPORTE_VER' },
      },
      {
        path: 'acceso-denegado',
        loadComponent: () =>
          import('./shared/pages/acceso-denegado.component').then((m) => m.AccesoDenegadoComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/pages/no-encontrado.component').then((m) => m.NoEncontradoComponent),
      },
    ],
  },
];
