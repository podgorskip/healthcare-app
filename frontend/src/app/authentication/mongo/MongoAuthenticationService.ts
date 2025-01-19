import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Authentication } from '../../model/Authentication';
import { UserIdentityInfo } from '../UserIdentityInfo';
import { environment } from '../../../environments/environment';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import { AuthenticationServiceInterface } from '../interfaces/AuthenticationServiceInterface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MongoAuthenticationService implements AuthenticationServiceInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/auth`;

  constructor(private http: HttpClient, private userIdentityInfo: UserIdentityInfo, private router: Router) { }

  authenticate(credentials: Authentication): void {
    console.log('.authenticate - invoked');

    this.http.post<{ token: string; user: Partial<User> }>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        console.log(response);
      }),
      switchMap(() => {
        const headers = this.authHeaders();
        return this.http.get<User>(`${this.apiUrl}/account`, { headers }); 
      })
    ).subscribe({
      next: (user) => {
        this.userIdentityInfo.setAuthenticatedUser(user);
        this.router.navigate(['/patient-dashboard']);
      },
      error: (error) => {
        console.error('Authentication or user retrieval failed:', error);
      }
    });
  }

  logout(): void {
    console.log('.logout - invoked');

    localStorage.removeItem('token');
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