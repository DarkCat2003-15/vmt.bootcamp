import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Student, StudentFormValue } from '../interfaces/students.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly endpoint = `${environment.apiUrl}/students`;

  constructor(private readonly http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.endpoint);
  }
  
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.endpoint}/${id}`);
  }

  createStudent(student: StudentFormValue): Observable<Student> {
    return this.http.post<Student>(this.endpoint, {
      ...student,
      createdAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/120?u=${encodeURIComponent(student.email)}`,
    });
  }

  updateStudent(id: string, student: StudentFormValue): Observable<Student> {
    return this.http.put<Student>(`${this.endpoint}/${id}`, student);
  }

  deleteStudent(id: string): Observable<Student> {
    return this.http.delete<Student>(`${this.endpoint}/${id}`);
  }
}
