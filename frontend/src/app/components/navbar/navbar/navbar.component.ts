import { Authorization } from './../../../authentication/AuthorizationService';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { User } from '../../../model/User';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { CommonModule, NgIf } from '@angular/common';
import { Role } from '../../../model/enum/Role';
import { PatientService } from '../../../services/patient/patient.service';
import { catchError, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Patient } from '../../../model/Patient';
import { Doctor } from '../../../model/Doctor';
import { DoctorService } from '../../../services/doctor/doctor.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, CommonModule],
  providers: [CartService, AuthenticationService, PatientService, DoctorService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  Authorization = Authorization;
  cartItemsCount: number = 0;
  authenticatedUser: User | null = null;
  patient?: Patient;
  doctor?: Doctor;
  
  constructor(
    private userIdentityInfo: UserIdentityInfo, 
    private cartService: CartService, 
    private patientService: PatientService,
    private doctorService: DoctorService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$
      .pipe(takeUntil(this.unsubscribe$)).pipe(
        tap((user) => {
          if (user) {
            console.log('Authenticated user: ', user);
            this.authenticatedUser = user;
          } else {
            console.log('Unauthenticated.');
            this.authenticatedUser = null;
            this.patient = undefined;
            this.doctor = undefined;
            this.cartItemsCount = 0;
          }
        }),
        switchMap((user) => {
          if (!user) {
            return []; 
          }
  
          if (Authorization.isPatient(this.authenticatedUser?.role)) {
            return this.patientService.getPatientById(user.id).pipe(
              switchMap((patient) => {
                return this.cartService.getCart(patient.id).pipe(
                  tap((cart) => {
                    this.patient = patient;
                    this.cartItemsCount = cart.items ? cart.items.length : 0;
                    this.patient.cart = cart;
                    this.patient.user = user;
                  })
                );
              })
            );
          }
  
          if (Authorization.isDoctor(this.authenticatedUser?.role)) {
            return this.doctorService.getDoctor(user.id).pipe(
              tap((doctor) => {
                this.doctor = doctor;
                this.doctor.user = user;
                console.log('Doctor data loaded: ', doctor);
              })
            );
          }
  
          return [];
        }),
        catchError((err) => {
          console.error('An error occurred: ', err);
          return [];
        })
      )
      .subscribe();
  }
  
  logout = () => {
    this.authenticationService.authenticationService.logout();
    this.userIdentityInfo.setAuthenticatedUser(null);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isAuthenticated = (): boolean => {
    return this.authenticatedUser != null;
  }
}
