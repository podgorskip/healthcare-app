import { Component } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../../model/Doctor';
import { Role } from '../../../model/enum/Role';

@Component({
  selector: 'doctor-creator',
  standalone: true,
  imports: [FormsModule],
  providers: [DoctorService],
  templateUrl: './doctor-creator.component.html',
  styleUrl: './doctor-creator.component.css'
})
export class DoctorCreatorComponent {
  doctor!: Doctor

  constructor(private doctorService: DoctorService) {
    this.doctor = this.clearForm();
  }

  onDoctorAdd = (form: any): void => {
    if (!form.valid) {
      alert('Fill up the form.');
      return;
    }

    this.doctorService.addDoctor(this.doctor).subscribe({
      next: (response) =>{
        console.log(`Response: ${response.ge}`)
        this.doctor = this.clearForm();
      },
      error: (err) => console.error(`Error: ${err}`)
    });
  };

  clearForm = (): Doctor => {
    return {
      id: '',
      user: {
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        role: Role.DOCTOR
      },
      phoneNo: ''
    };
  }
}
