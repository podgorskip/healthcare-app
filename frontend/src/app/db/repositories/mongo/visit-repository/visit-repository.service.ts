import { Injectable } from '@angular/core';
import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongoVisitRepository implements VisitRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/scheduled`;

  constructor(private http: HttpClient) {}

  listenToScheduledVisitUpdates(callback: (visits: ScheduledVisit[]) => void): void {
    console.log('.listenToScheduledVisitUpdates - invoked');

    const func = async () => {
      try {
        const response = await fetch(`${this.apiUrl}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch scheduled visits`);
        }
        const visits: ScheduledVisit[] = await response.json();

        visits.forEach(visit => {
          if (visit.date && visit.date.length > 0) {
            visit.date.forEach(dateObj => {
              dateObj.day = new Date(dateObj.day);
            });
          }
        });
        callback(visits);
      } catch (error) {
        console.error('Error:', error);
        callback([]); 
      }
    };

    func();
  }

  async removeScheduledVisit(id: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, visit id=${id}`);
    const response = await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
    console.log('Server response: ', response);
  }

  async addScheduledVisit(visit: ScheduledVisit): Promise<string> {
    console.log('.addScheduledVisit - invoked');

    try {
      const response = await firstValueFrom(this.http.post<string>(`${this.apiUrl}`, visit));
      return response; 
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getScheduledVisitById(id: string): Promise<ScheduledVisit> {
    console.log(`.getScheduledVisitById - invoked, visit id=${id}`);

    try {
      const response = await firstValueFrom(this.http.get<ScheduledVisit>(`${this.apiUrl}/${id}`));
      return response; 
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateVisit(visit: ScheduledVisit): Promise<void> {
    console.log(`.updateVisit - invoked, visit id=${visit.id}`);

    try {
      const response = await firstValueFrom(this.http.put(`${this.apiUrl}/${visit.id}`, visit));
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
