import { Routes } from '@angular/router';

import { CourseDetail } from '../pages/course-detail/course-detail';
import { CourseList } from '../pages/course-list/course-list';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    component: CourseList,
  },
  {
    path: ':id',
    component: CourseDetail,
  },
];
