export interface Course {
  id: string;
  createdAt: string;
  description: string;
  name: string;
  level: string;
  instructor: string;
}

export type Courses = Course;

export type CourseFormValue = Pick<Course, 'description' | 'name' | 'level' | 'instructor'>;
