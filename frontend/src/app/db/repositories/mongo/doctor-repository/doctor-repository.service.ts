import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { DoctorRepositoryInterface } from '../../../interfaces/DoctorRepositoryInterface';
import { Doctor } from '../../../../model/Doctor';
import { Observable } from 'rxjs';
import { SingleDayAvailability } from '../../../../model/SingleDayAvailability';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';

@Injectable({
  providedIn: 'root'
})
export class MongoDoctorRepository implements DoctorRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/doctors`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) { }

  addDoctor(doctor: Doctor): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.post<any>(this.apiUrl, doctor, { headers });
  }

  getDoctors(): Observable<Doctor[]> {
    const headers = this.auth.authHeaders();
    return this.http.get<Doctor[]>(this.apiUrl, { headers });
  }

  getDoctorById(id: string): Observable<Doctor> {
    const headers = this.auth.authHeaders();
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`, { headers });
  }

  removeDoctor(id: string): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    const headers = this.auth.authHeaders();
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/${id}/visits`, { headers });
  }

  getDoctorAvailability(id: string, type: string): Observable<SingleDayAvailability[]> {
    const headers = this.auth.authHeaders();
    return this.http.get<SingleDayAvailability[]>(`${this.apiUrl}/${id}/availability?type=${type}`, { headers });
  }

  addDoctorAvailability(id: string, availabilities: SingleDayAvailability[], type: string): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.post<any>(`${this.apiUrl}/${id}/availability?type=${type}`, availabilities, { headers });
  }
}
