import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserIdentityInfo } from '../UserIdentityInfo';
import { Authentication } from '../../model/Authentication';
import { signInWithEmailAndPassword, User as FirebaseUser } from 'firebase/auth';
import { User } from '../../model/User';
import { Role } from '../../model/enum/Role';
import { FirebaseInitializationService } from '../../db/setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthenticationService {
  constructor(
    private userIdentityInfo: UserIdentityInfo,
    private router: Router,
    private firebaseInit: FirebaseInitializationService
  ) {}

  authenticate(credentials: Authentication): void {
    const auth = this.firebaseInit.getAuth(); 
    signInWithEmailAndPassword(auth, credentials.username, credentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          localStorage.setItem('token', user.refreshToken);
          const customUser = this.mapFirebaseUserToCustomUser(user);
          this.userIdentityInfo.setAuthenticatedUser(customUser);
          this.router.navigate(['/doctors']);
        }
      })
      .catch((error) => {
        console.error('Authentication failed:', error);
      });
  }

  refreshAccessToken(): Observable<any> {
    const auth = this.firebaseInit.getAuth(); 
    const user = auth.currentUser;

    if (user) {
      return from(user.getIdToken(true)).pipe(
        tap((token) => {
          localStorage.setItem('token', token);
        }),
        catchError((error) => {
          console.error('Error refreshing access token:', error);
          return throwError(() => new Error(error));
        })
      );
    } else {
      return throwError(() => new Error('User not authenticated'));
    }
  }

  logout(): void {
    const auth = this.firebaseInit.getAuth(); 
    auth.signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.userIdentityInfo.setAuthenticatedUser(null);
        this.router.navigate(['/login']);
        console.log('User logged out successfully.');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  getAccessToken(): Observable<string> {
    const auth = this.firebaseInit.getAuth();
    const user = auth.currentUser;

    if (user) {
      return from(user.getIdToken()).pipe(
        catchError((error) => {
          console.error('Error getting access token:', error);
          return throwError(() => new Error(error));
        })
      );
    } else {
      return throwError(() => new Error('User not authenticated'));
    }
  }

  refreshToken(): Observable<string> {
    return this.refreshAccessToken();
  }

  private mapFirebaseUserToCustomUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      username: firebaseUser.displayName || '',
      role: Role.PATIENT,
      firstName: '',
      lastName: '',
    };
  }
}
