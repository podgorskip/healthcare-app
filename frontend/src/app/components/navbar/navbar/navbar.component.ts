import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { User } from '../../../model/User';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { CommonModule, NgIf } from '@angular/common';
import { Role } from '../../../model/enum/Role';
import { PatientService } from '../../../services/patient/patient.service';
import { catchError, Subject, switchMap, tap } from 'rxjs';
import { Patient } from '../../../model/Patient';
import { Doctor } from '../../../model/Doctor';
import { DoctorService } from '../../../services/doctor/doctor.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, CommonModule],
  providers: [CartService, AuthenticationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  cartItemsCount: number = 0;
  authenticatedUser?: User;
  patient?: Patient;
  doctor?: Doctor;

  roles: { [key: number]: Role } = {
    1: Role.ADMIN,
    2: Role.DOCTOR,
    3: Role.PATIENT,
  };
  
  constructor(
    private userIdentityInfo: UserIdentityInfo, 
    private cartService: CartService, 
    private patientService: PatientService,
    private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$
      .pipe(
        tap((user) => {
          if (user) {
            console.log('Authenticated user: ', user);
            this.authenticatedUser = user;
          }
        }),
        switchMap((user) => {
          if (!user) {
            return []; 
          }
  
          if (this.hasAccess(Role.PATIENT)) {
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
  
          if (this.hasAccess(Role.DOCTOR)) {
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
  

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isAuthenticated = (): boolean => {
    return this.authenticatedUser !== undefined;
  }

  hasAccess = (role: Role): boolean => {
    return Number(this.authenticatedUser?.role) === role;
  }
}
