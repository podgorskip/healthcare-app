import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Doctor } from '../../model/Doctor';
import { DoctorCreatorComponent } from '../admin/doctor-creator/doctor-creator.component';
import { User } from '../../model/User';
import { UserIdentityInfo } from '../../authentication/UserIdentityInfo';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [DoctorCreatorComponent, NgIf, NgFor],
  providers: [DoctorService],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  authenticatedUser?: User;
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService, private auth: UserIdentityInfo) { }

  onDoctorDelete = (id: string): void => {
    this.doctorService.removeDoctor(id).subscribe({
      next: (response) => console.log(`Response: ${response}`)
    })
  }

  ngOnInit(): void {
    this.doctorService.doctors$.subscribe({
      next: (doctors) => this.doctors = doctors
    })

    this.auth.authenticatedUser$.subscribe({
      next: (user) => this.authenticatedUser = user
    })
  }
}
