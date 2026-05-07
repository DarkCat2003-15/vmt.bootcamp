import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environment/environment';
import { Patients } from '../interfaces/patients.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getAll(): Observable<Patients[]> {
    return this._http.get<Patients[]>(`${this.apiUrl}/patients`);
  }

  create(patient: Partial<Patients>): Observable<Patients> {
    return this._http.post<Patients>(`${this.apiUrl}/patients`, patient);
  }

  update(id: string, patient: Partial<Patients>): Observable<Patients> {
    return this._http.put<Patients>(`${this.apiUrl}/patients/${id}`, patient);
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/patients/${id}`);
  }
}
