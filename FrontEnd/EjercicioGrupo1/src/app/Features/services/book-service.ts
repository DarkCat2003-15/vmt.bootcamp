import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Book, BookFormValue } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly endpoint = `${environment.apiUrl}/books`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.endpoint);
  }

  getById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.endpoint}/${id}`);
  }

  create(book: BookFormValue): Observable<Book> {
    return this.http.post<Book>(this.endpoint, {
      ...book,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, book: BookFormValue): Observable<Book> {
    return this.http.put<Book>(`${this.endpoint}/${id}`, book);
  }

  delete(id: string): Observable<Book> {
    return this.http.delete<Book>(`${this.endpoint}/${id}`);
  }
}
