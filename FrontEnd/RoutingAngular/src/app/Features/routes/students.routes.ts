import { Routes } from '@angular/router';

import { StudentDetail } from '../pages/student-detail/student-detail';
import { StudentList } from '../pages/student-list/student-list';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: StudentList,
  },
  {
    path: ':id',
    component: StudentDetail,
  },
];
