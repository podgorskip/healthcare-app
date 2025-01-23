import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReviewRepositoryInterface } from '../../../interfaces/ReviewRepositoryInterface';
import { Review } from '../../../../model/Review';

@Injectable({
  providedIn: 'root'
})
export class MongoReviewRepository implements ReviewRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getDoctorReviews(id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/doctors/${id}`);
  }

  addReviewComment(id: string, comment: { comment: string, user: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comments`, comment);
  }

  removeReviewComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${id}`);
  }  
}
