import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layouts/public/public-layout/public-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                loadComponent: () =>
                    import('./features/pages/public/home-component/home-component').then((m) => m.HomeComponent),
            },
            {
                path: 'about',
                loadComponent: () =>
                    import('./features/pages/public/about-us-component/about-us-component').then((m) => m.AboutComponent),
            },
            {
                path: 'contact',
                loadComponent: () =>
                    import('./features/pages/public/contact-us-component/contact-us-component').then((m) => m.ContactComponent),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/pages/private/login-component/login-component').then((m) => m.LoginComponent),
            },
        ],
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./core/layouts/private/private-layout/private-layout').then((m) => m.AdminLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/pages/private/dashboard-component/dashboard-component').then((m) => m.DashboardComponent),
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./features/pages/private/product-component/pages/component/product-component').then((m) => m.ProductsComponent),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];