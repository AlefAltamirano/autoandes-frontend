import { Permiso } from '../auth/auth.model';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  permiso: Permiso;
}


export const MENU: MenuItem[] = [
  { label: 'Servicios', icon: 'wrench', route: '/servicios', permiso: 'SERVICIO_LEER' },
  { label: 'Vehículos', icon: 'car', route: '/vehiculos', permiso: 'VEHICULO_LEER' },
  { label: 'Órdenes', icon: 'clipboard', route: '/ordenes', permiso: 'ORDEN_LEER' },
  { label: 'Reportes', icon: 'chart-bar', route: '/reportes', permiso: 'REPORTE_VER' },
];
