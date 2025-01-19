import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Doctor } from '../../model/Doctor';
import { User } from '../../model/User';
import { UserIdentityInfo } from '../../authentication/UserIdentityInfo';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Authorization } from '../../authentication/AuthorizationService';
import { ReviewComponent } from '../review/review/review.component';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ReviewComponent, CommonModule],
  providers: [DoctorService],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  Authorization = Authorization;
  authenticatedUser: User | null = null;
  selectedDoctor: string = '';
  doctors: Doctor[] = [];

  constructor(
    private doctorService: DoctorService, 
    private userIdentityInfo: UserIdentityInfo,
    private router: Router
  ) { }

  onDoctorDelete = (id: string): void => {
    this.doctorService.removeDoctor(id).subscribe({
      next: (response) => console.log(`Response: ${response}`)
    })
  }

  onScheduleClick = (id: string): void => {
    console.log('Schedule visit for: ', id)
    this.router.navigate(['/schedule', id])
  }

  ngOnInit(): void {
    this.doctorService.doctors$.subscribe({
      next: (doctors) => {
        console.log('Fetched doctors: ', doctors);
        this.doctors = doctors;
        if (doctors.length) {
          this.selectedDoctor = doctors[0].id;
        }
      }
    })

    this.userIdentityInfo.authenticatedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => this.authenticatedUser = user
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
