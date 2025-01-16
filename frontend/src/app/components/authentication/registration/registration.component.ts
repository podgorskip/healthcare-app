import { firstValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { User } from '../../../model/User';
import { Sex } from '../../../model/enum/Sex';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Role } from '../../../model/enum/Role';
import { PatientService } from '../../../services/patient/patient.service';
import { Patient } from '../../../model/Patient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  providers: [PatientService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  sex: Sex[] = Object.values(Sex);
  patient: Patient = {
    id: '',
    user: {
      id: '',
      role: Role.PATIENT,
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      age: 0,
      sex: Sex.MALE
    },
    cart: {
      id: ''
    }
  }

  constructor(private patientService: PatientService, private router: Router) {}

  sectionStyle = (flag: boolean): any => {
    const predicate: boolean = this.overallFilled();
    return {
      'color': predicate || flag ? 'black' : 'rgb(190, 190, 190)',
    };
  };

  sectionBorderStyle = (flag: boolean): any => {
    const predicate: boolean = this.overallFilled();
    return {
      'border': predicate || flag ? '1px solid rgb(45, 45, 45)' : '1px solid rgb(190, 190, 190)',
      'color': predicate || flag ? 'rgb(45, 45, 45)' : 'rgb(190, 190, 190)'
    };
  };

  overallFilled = (): boolean => {
    return (
      this.patient.user.firstName !== '' &&
      this.patient.user.lastName !== '' &&
      this.patient.user.username !== '' &&
      this.patient.user.password !== ''
    );
  };

  submit = (): void => {
    if (this.overallFilled()) {
      this.patientService.addPatient(this.patient).subscribe({
        next: (response) => {
          console.log(`Response: ${response}`);
          this.router.navigate(['/login']);
        }
      })
    }
  }
}
