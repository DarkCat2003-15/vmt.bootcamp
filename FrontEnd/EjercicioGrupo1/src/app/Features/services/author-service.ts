import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Author, AuthorFormValue } from '../interfaces/author.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly endpoint = `${environment.apiUrl}/authors`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.endpoint);
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.endpoint}/${id}`);
  }

  create(author: AuthorFormValue): Observable<Author> {
    return this.http.post<Author>(this.endpoint, {
      ...author,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, author: AuthorFormValue): Observable<Author> {
    return this.http.put<Author>(`${this.endpoint}/${id}`, author);
  }

  delete(id: string): Observable<Author> {
    return this.http.delete<Author>(`${this.endpoint}/${id}`);
  }
}
