import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MongoAuthenticationService } from '../authentication/mongo/MongoAuthenticationService';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: MongoAuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken(); 
    console.log('Intercepting: ', accessToken);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Token expired') {
          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newRequest);
            }),
            catchError(() => {
              this.authService.logout(); 
              this.router.navigate(['/login']);
              return throwError(error);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
