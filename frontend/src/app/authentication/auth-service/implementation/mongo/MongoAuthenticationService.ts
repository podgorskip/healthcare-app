import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Authentication } from '../../../../model/Authentication';
import { environment } from '../../../../../environments/environment';
import { AuthenticationServiceInterface } from '../../interfaces/AuthenticationServiceInterface';
import { UserIdentityInfo } from '../../../UserIdentityInfo';
import { User } from '../../../../model/User';

@Injectable({
  providedIn: 'root'
})
export class MongoAuthenticationService implements AuthenticationServiceInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/auth`;

  constructor(private http: HttpClient, private userIdentityInfo: UserIdentityInfo, private router: Router) { }

  authenticate(credentials: Authentication): Observable<User | null> {
    console.log('.authenticate - invoked');
  
    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      switchMap(() => {
        return this.http.get<User>(`${this.apiUrl}/account`);
      }),
      tap((user) => {
        this.userIdentityInfo.setAuthenticatedUser(user);
      }),
      catchError((error) => {
        console.error('Authentication or user retrieval failed:', error);
        return of(null);
      })
    );
  }
  

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.accessToken);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        return throwError(() => new Error(error)); 
      })
    );
  }
  
  logout(): void {
    console.log('.logout - invoked');

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.userIdentityInfo.setAuthenticatedUser(null);

    this.router.navigate(['/login']);
    console.log('User logged out successfully.');
  }

  authHeaders(): HttpHeaders {
    return new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      });
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken')!;
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<string>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      catchError(error => {
        console.error('Token refresh failed:', error);
        throw error; 
      })
    );
  }
}