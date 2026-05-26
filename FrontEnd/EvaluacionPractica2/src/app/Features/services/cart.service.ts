import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Cart, CartPayload, CartsResponse } from '../interfaces/cart.interface';

export interface CartQuery {
  limit?: number;
  skip?: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly endpoint = `${environment.apiUrl}/carts`;
  private readonly http = inject(HttpClient);

  getAll(query: CartQuery = {}): Observable<CartsResponse> {
    return this.http.get<CartsResponse>(this.endpoint, {
      params: this.buildParams(query),
    });
  }

  getById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.endpoint}/${id}`);
  }

  create(payload: CartPayload): Observable<Cart & { created?: boolean }> {
    return this.http.post<Cart & { created?: boolean }>(`${this.endpoint}/add`, payload);
  }

  update(id: number, payload: CartPayload): Observable<Cart> {
    return this.http.put<Cart>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.endpoint}/${id}`);
  }

  private buildParams(query: CartQuery): HttpParams {
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
