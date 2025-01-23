import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DoctorRepositoryInterface } from '../../../interfaces/DoctorRepositoryInterface';
import { Doctor } from '../../../../model/Doctor';
import { Observable, Subscription } from 'rxjs';
import { SingleDayAvailability } from '../../../../model/SingleDayAvailability';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { WebSocketService } from '../../../../sockets/WebSocketService';

@Injectable({
  providedIn: 'root'
})
export class MongoDoctorRepository implements DoctorRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/doctors`;

  constructor(private http: HttpClient, private webSocketService: WebSocketService) { }

  addDoctor(doctor: Doctor): Observable<any> {
    return this.http.post<any>(this.apiUrl, doctor);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  removeDoctor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    return this.http.get<ScheduledVisit[]>(`${this.apiUrl}/${id}/visits`);
  }

  getDoctorAvailability(id: string, type: string): Observable<SingleDayAvailability[]> {
    return this.http.get<SingleDayAvailability[]>(`${this.apiUrl}/${id}/availability?type=${type}`);
  }

  addDoctorAvailability(id: string, availabilities: SingleDayAvailability[], type: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/availability?type=${type}`, availabilities);
  }

  startListeningAvailabilityChange(id: string, type: string): Observable<SingleDayAvailability[]> {
    console.log(`Started listening to: availability-${id}-${type}`);
    return new Observable((observer) => {
      this.webSocketService.listen(`availability-${id}-${type}`).subscribe({
        next: (response: { availability: SingleDayAvailability[] }) => {
          console.log('WebSocket availability update: ', response.availability);
          observer.next(response.availability);
        },
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket subscription completed'),
      });      
    });
  }

  startListeningVisitChange(id: string): Observable<ScheduledVisit[]> {
    console.log(`Started listening to: visit-${id}`);
    return new Observable((observer) => {
      this.webSocketService.listen(`visit-${id}`).subscribe((response: { visits: ScheduledVisit[] }) => {
        observer.next(response.visits);
      });
    });
  }
}
