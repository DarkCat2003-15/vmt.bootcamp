import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'SteamClone | Inicio',
  },
  {
    path: 'juegos',
    loadComponent: () => import('./pages/products/products').then((m) => m.Products),
    title: 'SteamClone | Juegos',
  },
  {
    path: 'quienes-somos',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
    title: 'SteamClone | Quienes somos',
  },
  {
    path: 'contactanos',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: 'SteamClone | Contactanos',
  },
  {
    path: 'login',
    loadComponent: () => import('../auth/pages/login/login').then((m) => m.Login),
    title: 'SteamClone | Login',
  },
];
