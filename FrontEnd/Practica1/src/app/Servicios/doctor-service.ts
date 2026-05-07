import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environment/environment';
import { Doctors } from '../interfaces/doctors.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getAll(): Observable<Doctors[]> {
    return this._http.get<Doctors[]>(`${this.apiUrl}/doctors`);
  }

  create(doctor: Partial<Doctors>): Observable<Doctors> {
    return this._http.post<Doctors>(`${this.apiUrl}/doctors`, doctor);
  }

  update(id: string, doctor: Partial<Doctors>): Observable<Doctors> {
    return this._http.put<Doctors>(`${this.apiUrl}/doctors/${id}`, doctor);
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/doctors/${id}`);
  }
}
