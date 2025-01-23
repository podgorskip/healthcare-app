import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';

@Injectable({
  providedIn: 'root'
})
export class MongoUserRepository implements UserRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  toggleUserBan(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {});
  }
}
