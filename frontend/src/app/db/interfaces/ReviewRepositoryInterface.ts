import { Observable } from 'rxjs';
import { User } from '../../model/User';
import { Review } from '../../model/Review';

export interface ReviewRepositoryInterface {
  getDoctorReviews(id: string): Observable<Review[]>;
   
  addReviewComment(id: string, comment: { comment: string, user: string }): Observable<any>;

  removeReviewComment(id: string): Observable<any>;
}
