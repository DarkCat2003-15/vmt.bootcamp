import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductPayload } from '../../interfaces/private/product.interface';
import { Product } from '../../interfaces/public/public-interfaces';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private url = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.url);
    }

    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.url}/${id}`);
    }

    create(payload: ProductPayload): Observable<Product> {
        return this.http.post<Product>(this.url, payload);
    }

    update(id: number, payload: ProductPayload): Observable<Product> {
        return this.http.put<Product>(`${this.url}/${id}`, payload);
    }

    delete(id: number): Observable<Product> {
        return this.http.delete<Product>(`${this.url}/${id}`);
    }
}