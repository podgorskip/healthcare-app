import { Component } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { FormsModule } from '@angular/forms';
import { Doctor } from '../../../model/Doctor';

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
    firstName: '',
    lastName: '',
    phoneNo: '',
    username: '',
    password: ''
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
