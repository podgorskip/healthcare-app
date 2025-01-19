import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';

@Injectable({
  providedIn: 'root'
})
export class MongoUserRepository implements UserRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/users`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) {}

  getUsers(): Observable<User[]> {
    const headers = this.auth.authHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  toggleUserBan(id: string): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.patch<any>(`${this.apiUrl}/${id}`, {}, { headers });
  }
}
