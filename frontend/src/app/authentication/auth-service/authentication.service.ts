import { Injectable } from '@angular/core';
import { AuthenticationServiceInterface } from './interfaces/AuthenticationServiceInterface';
import { AuthenticationServiceFactory } from './factory/AuthenticationServiceFactory';
import { Authentication } from '../../model/Authentication';
import { Observable } from 'rxjs';
import { User } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticationService: AuthenticationServiceInterface;

  constructor(authService: AuthenticationServiceFactory) {
    this.authenticationService = authService.getService();
  }

  authenticate(credentials: Authentication): Observable<User | null> {
    return this.authenticationService.authenticate(credentials);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  refreshAccessToken(): Observable<any> {
    return this.authenticationService.refreshAccessToken();
  }
}