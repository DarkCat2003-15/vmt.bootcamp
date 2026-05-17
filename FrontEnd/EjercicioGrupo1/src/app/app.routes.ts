import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'books',
  },
  {
    path: 'books',
    loadChildren: () => import('./Features/routes/books.routes').then((routes) => routes.BOOK_ROUTES),
  },
  {
    path: 'authors',
    loadChildren: () => import('./Features/routes/authors.routes').then((routes) => routes.AUTHOR_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'books',
  },
];
