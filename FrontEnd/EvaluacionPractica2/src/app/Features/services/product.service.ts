import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  Product,
  ProductCategoriesResponse,
  ProductPayload,
  ProductsResponse,
} from '../interfaces/product.interface';

export interface ProductQuery {
  limit?: number;
  skip?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly endpoint = `${environment.apiUrl}/products`;
  private readonly http = inject(HttpClient);

  getAll(query: ProductQuery = {}): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.endpoint, {
      params: this.buildParams(query),
    });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }

  getCategories(): Observable<ProductCategoriesResponse> {
    return this.http.get<ProductCategoriesResponse>(`${this.endpoint}/categories`);
  }

  search(term: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.endpoint}/search`, {
      params: new HttpParams().set('q', term),
    });
  }

  getByCategory(category: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.endpoint}/category/${category}`);
  }

  create(payload: ProductPayload): Observable<Product & { created?: boolean }> {
    return this.http.post<Product & { created?: boolean }>(`${this.endpoint}/add`, payload);
  }

  update(id: number, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.endpoint}/${id}`);
  }

  private buildParams(query: ProductQuery): HttpParams {
    let params = new HttpParams();
    if (query.limit !== undefined) {
      params = params.set('limit', query.limit);
    }
    if (query.skip !== undefined) {
      params = params.set('skip', query.skip);
    }
    return params;
  }
}
