import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
import { WebSocketService } from '../../../../sockets/WebSocketService';

@Injectable({
  providedIn: 'root'
})
export class MongoVisitRepository implements VisitRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/visits`;

  constructor(private http: HttpClient, private webSocketService: WebSocketService) {}

  getPatientVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getPatientVisits - invoked, visit id=${id}`);
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/patients/${id}`);
  }

  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getDoctorVisits - invoked, visit id=${id}`);
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/doctors/${id}`);
  }

  addVisit(visit: ScheduledVisit): Observable<ScheduledVisit> {
    console.log('.addVisit - invoked');

    try {
      return this.http.post<ScheduledVisit>(`${this.apiUrl}`, visit);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  cancelVisit(id: string): Observable<ScheduledVisit> {
    console.log(`.cancelVisit - invoked, visit id=${id}`);

    try {
      return this.http.put<ScheduledVisit>(`${this.apiUrl}/${id}/cancel`, {});
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  deleteVisit(id: string): Observable<string> {
    console.log(`.deleteVisit - invoked, visit id=${id}`);

    try {
      return this.http.delete<string>(`${this.apiUrl}/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  addVisitReview(review: { score: number, comment: string}, id: string): Observable<any> {
    console.log(`.addVisitReview - invoked`);
    try {
      return this.http.post<string>(`${this.apiUrl}/${id}/reviews`, review);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  startListeningVisitCancellation(id: string): Observable<ScheduledVisit> {
    console.log('.startListeningVisitCancellation - invoked');
    return new Observable((observer) => {
      this.webSocketService.listen(`visit-${id}-cancellation`).subscribe({
        next: (response: { visit: ScheduledVisit }) => {
          console.log('WebSocket visit cancelled: ', response.visit);
          observer.next(response.visit);
        },
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket subscription completed'),
      });      
    });
  }
}
