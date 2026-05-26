import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './Core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Features/public/layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Features/public/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./Features/public/pages/products/products').then((m) => m.Products),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./Features/public/pages/about/about').then((m) => m.About),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./Features/public/pages/contact/contact').then((m) => m.Contact),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./Features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Features/admin/layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Features/admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./Features/admin/pages/products-management/products-management').then(
            (m) => m.ProductsManagement,
          ),
      },
      {
        path: 'carts',
        loadComponent: () =>
          import('./Features/admin/pages/carts-management/carts-management').then(
            (m) => m.CartsManagement,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
