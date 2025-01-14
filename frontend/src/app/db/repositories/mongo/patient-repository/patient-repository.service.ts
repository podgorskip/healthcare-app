import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { Observable } from 'rxjs';
import { Patient } from '../../../../model/Patient';
import { PatientRepositoryInterface } from '../../../interfaces/PatientRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class MongoPatientRepository implements PatientRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/patients`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) { }

  addPatient(patient: Patient): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.post<any>(this.apiUrl, patient, { headers });
  }

  getPatientById(id: string): Observable<Patient> {
    const headers = this.auth.authHeaders();
    return this.http.get<Patient>(`${this.apiUrl}/${id}`, { headers });
  }
}
