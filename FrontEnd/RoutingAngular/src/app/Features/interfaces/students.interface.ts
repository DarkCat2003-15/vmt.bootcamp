export interface Student {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  courseId: string;
}

export type Students = Student;

export type StudentFormValue = Pick<Student, 'name' | 'email' | 'courseId'>;
