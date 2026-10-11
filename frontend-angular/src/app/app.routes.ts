import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./pages/productos/productos.component').then((m) => m.ProductosComponent),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/categorias/categorias.component').then((m) => m.CategoriasComponent),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/inventario/inventario.component').then((m) => m.InventarioComponent),
      },
      {
        path: 'movimientos',
        loadComponent: () =>
          import('./pages/movimientos/movimientos.component').then((m) => m.MovimientosComponent),
      },
      {
        path: 'alertas',
        loadComponent: () =>
          import('./pages/alertas/alertas.component').then((m) => m.AlertasComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
