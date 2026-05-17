import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'students',
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./Features/routes/students.routes').then((routes) => routes.STUDENT_ROUTES),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./Features/routes/courses.routes').then((routes) => routes.COURSE_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'students',
  },
];
