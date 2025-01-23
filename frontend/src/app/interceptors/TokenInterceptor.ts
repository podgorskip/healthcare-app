import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationServiceInterface } from '../authentication/auth-service/interfaces/AuthenticationServiceInterface';
import { AuthenticationServiceFactory } from '../authentication/auth-service/factory/AuthenticationServiceFactory';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authenticationService: AuthenticationServiceInterface;

  constructor(private auth: AuthenticationServiceFactory) {
    this.authenticationService = auth.getService();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('token');

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 && accessToken) {
          return this.handleTokenExpired(request, next);
        }

        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Handling expired token.');
    
    return this.authenticationService.refreshAccessToken().pipe(
      switchMap(() => {
        const newAccessToken = localStorage.getItem('token');
        if (newAccessToken) {
          return next.handle(this.addToken(request, newAccessToken));
        } else {
          throw new Error('No access token found.');
        }
      }),
      catchError((error) => {
        console.error('Error handling expired access token:', error);
        return throwError(error);
      })
    );
  }
}