import { Component } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../../model/Doctor';
import { Role } from '../../../model/enum/Role';
import { Sex } from '../../../model/enum/Sex';

@Component({
  selector: 'doctor-creator',
  standalone: true,
  imports: [FormsModule],
  providers: [DoctorService],
  templateUrl: './doctor-creator.component.html',
  styleUrl: './doctor-creator.component.css'
})
export class DoctorCreatorComponent {
  doctor: Doctor = {
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

  constructor(private doctorService: DoctorService) { }

  onDoctorAdd = (form: any): void => {
    if (!form.valid) {
      alert('Fill up the form.');
      return;
    }

    this.doctorService.addDoctor(this.doctor).subscribe({
      next: (response) => console.log(`Response: ${response}`),
      error: (err) => console.error(`Error: ${err}`)
    });
  };
}
