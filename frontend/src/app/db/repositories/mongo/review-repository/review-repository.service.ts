import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';
import { ReviewRepositoryInterface } from '../../../interfaces/ReviewRepositoryInterface';
import { Review } from '../../../../model/Review';

@Injectable({
  providedIn: 'root'
})
export class MongoReviewRepository implements ReviewRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/reviews`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) {}

  getDoctorReviews(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/doctors/${id}`);
  }

  addReviewComment(id: string, comment: { comment: string, user: string }): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.post(`${this.apiUrl}/${id}/comments`, comment, { headers });
  }

  removeReviewComment(id: string): Observable<any> {
    const headers = this.auth.authHeaders();
    return this.http.delete(`${this.apiUrl}/comments/${id}`, { headers });
  }  
}
