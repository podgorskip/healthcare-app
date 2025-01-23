import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set, update, remove, push } from 'firebase/database';
import { ReviewRepositoryInterface } from '../../../interfaces/ReviewRepositoryInterface';
import { Review } from '../../../../model/Review';
import { Observable, from } from 'rxjs';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root'
})
export class FirebaseReviewRepository implements ReviewRepositoryInterface {
  private db: any;
  private dbPath = '/reviews'; 

  constructor(firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  getDoctorReviews(id: string): Observable<Review[]> {
    const reviewsRef = ref(this.db, `${this.dbPath}/doctors/${id}`);
    return new Observable((observer) => {
      get(reviewsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const reviews: Review[] = [];
            snapshot.forEach((childSnapshot) => {
              const review = childSnapshot.val();
              reviews.push(review); 
            });
            observer.next(reviews); 
            observer.complete();
          } else {
            observer.error('No reviews found for this doctor');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching reviews: ${error}`);
        });
    });
  }

  addReviewComment(id: string, comment: { comment: string, user: string }): Observable<any> {
    const commentRef = ref(this.db, `${this.dbPath}/comments/${id}`);
    return new Observable((observer) => {
      const newCommentRef = push(commentRef); 
      set(newCommentRef, comment)  
        .then(() => {
          observer.next({ message: 'Comment added successfully.' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error adding comment: ${error}`);
        });
    });
  }

  removeReviewComment(id: string): Observable<any> {
    const commentRef = ref(this.db, `${this.dbPath}/comments/${id}`);
    return new Observable((observer) => {
      remove(commentRef) 
        .then(() => {
          observer.next({ message: 'Comment removed successfully.' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error removing comment: ${error}`);
        });
    });
  }
}
