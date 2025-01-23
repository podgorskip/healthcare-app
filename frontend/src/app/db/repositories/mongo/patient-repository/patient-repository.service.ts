import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../../../model/Patient';
import { PatientRepositoryInterface } from '../../../interfaces/PatientRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class MongoPatientRepository implements PatientRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/patients`;

  constructor(private http: HttpClient) { }

  addPatient(patient: Patient): Observable<any> {
    return this.http.post<any>(this.apiUrl, patient);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }
}
