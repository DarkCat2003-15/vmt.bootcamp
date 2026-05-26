import { Inject, inject, Injectable } from "@angular/core";
import { environment } from "../../../environment/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../interfaces/product.interface";

@Injectable({ providedIn: 'root' })
export class ProductService {
    private readonly endpoint = `${environment.apiUrl}/products`;
    private readonly http = inject(HttpClient);

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.endpoint);
    }

    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.endpoint}/${id}`);
    }
    create(product: Product): Observable<Product> {
        return this.http.post<Product>(this.endpoint, product);
    }
    update(id: number, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.endpoint}/${id}`, product);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}