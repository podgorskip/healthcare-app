import { Injectable } from '@angular/core';
import { AuthenticationServiceInterface } from '../interfaces/AuthenticationServiceInterface';
import { AuthenticationServiceFactory } from '../factory/AuthenticationServiceFactory';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationService: AuthenticationServiceInterface;

  constructor(private authService: AuthenticationServiceFactory) {
    this.authenticationService = authService.getService();
  }
}