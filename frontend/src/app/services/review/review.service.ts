import { Injectable } from '@angular/core';
import { ReviewRepositoryFactory } from '../../db/factories/ReviewRepositoryFactory';
import { ReviewRepositoryInterface } from '../../db/interfaces/ReviewRepositoryInterface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../../model/Review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewSubject = new BehaviorSubject<Review[]>([]);
  private reviewRepository: ReviewRepositoryInterface;
  public reviews$ = this.reviewSubject.asObservable();

  constructor(reviewRepository: ReviewRepositoryFactory) { 
    this.reviewRepository = reviewRepository.getRepository();
  }

  getDoctorReviews = (id: string): Observable<Review[]> => {
    return this.reviewRepository.getDoctorReviews(id);
  }

  addReviewComment = (id: string, comment: { comment: string, user: string }): Observable<any> => {
    return this.reviewRepository.addReviewComment(id, comment);
  }

  removeReviewComment = (id: string): Observable<any> => {
    return this.reviewRepository.removeReviewComment(id);
  } 
}
