import { Routes } from '@angular/router';

import { AuthorDetail } from '../pages/author-detail/author-detail';
import { AuthorList } from '../pages/author-list/author-list';

export const AUTHOR_ROUTES: Routes = [
  {
    path: '',
    component: AuthorList,
  },
  {
    path: ':id',
    component: AuthorDetail,
  },
];
