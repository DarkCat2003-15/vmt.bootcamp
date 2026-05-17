import { Routes } from '@angular/router';

import { BookDetail } from '../pages/book-detail/book-detail';
import { BookList } from '../pages/book-list/book-list';

export const BOOK_ROUTES: Routes = [
  {
    path: '',
    component: BookList,
  },
  {
    path: ':id',
    component: BookDetail,
  },
];
