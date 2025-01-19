import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
import { Review } from '../../../../model/Review';

@Injectable({
  providedIn: 'root'
})
export class MongoVisitRepository implements VisitRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/visits`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) {}

  getPatientVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getPatientVisits - invoked, visit id=${id}`);

    const headers = this.auth.authHeaders();
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/patients/${id}`, { headers });
  }

  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getDoctorVisits - invoked, visit id=${id}`);

    const headers = this.auth.authHeaders();
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/doctors/${id}`, { headers });
  }

  addVisit(visit: ScheduledVisit): Observable<ScheduledVisit> {
    console.log('.addVisit - invoked');

    try {
      const headers = this.auth.authHeaders();
      return this.http.post<ScheduledVisit>(`${this.apiUrl}`, visit, { headers });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  cancelVisit(id: string): Observable<ScheduledVisit> {
    console.log(`.cancelVisit - invoked, visit id=${id}`);

    try {
      const headers = this.auth.authHeaders();
      return this.http.put<ScheduledVisit>(`${this.apiUrl}/${id}/cancel`, { headers });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  deleteVisit(id: string): Observable<string> {
    console.log(`.deleteVisit - invoked, visit id=${id}`);

    try {
      const headers = this.auth.authHeaders();
      return this.http.delete<string>(`${this.apiUrl}/${id}`, { headers });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  addVisitReview(review: { score: number, comment: string}, id: string): Observable<any> {
    console.log(`.addVisitReview - invoked`);
    try {
      const headers = this.auth.authHeaders();
      return this.http.post<string>(`${this.apiUrl}/${id}/reviews`, review, { headers });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
