import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Doctor } from '../../model/Doctor';
import { DoctorCreatorComponent } from '../admin/doctor-creator/doctor-creator.component';
import { User } from '../../model/User';
import { UserIdentityInfo } from '../../authentication/UserIdentityInfo';
import { NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [DoctorCreatorComponent, NgIf, NgFor],
  providers: [DoctorService],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  authenticatedUser?: User;
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
    this.router.navigate(['/schedule', id])
  }

  ngOnInit(): void {
    this.doctorService.doctors$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (doctors) => this.doctors = doctors
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
