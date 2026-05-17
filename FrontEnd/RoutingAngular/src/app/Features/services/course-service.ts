import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Course, CourseFormValue } from '../interfaces/courses.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly endpoint = `${environment.apiUrl}/courses`;

  constructor(private readonly http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.endpoint);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.endpoint}/${id}`);
  }

  createCourse(course: CourseFormValue): Observable<Course> {
    return this.http.post<Course>(this.endpoint, {
      ...course,
      createdAt: new Date().toISOString(),
    });
  }

  updateCourse(id: string, course: CourseFormValue): Observable<Course> {
    return this.http.put<Course>(`${this.endpoint}/${id}`, course);
  }

  deleteCourse(id: string): Observable<Course> {
    return this.http.delete<Course>(`${this.endpoint}/${id}`);
  }
}
