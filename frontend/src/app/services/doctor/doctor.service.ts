import { Injectable, OnInit } from '@angular/core';
import { DoctorRepositoryInterface } from '../../db/interfaces/DoctorRepositoryInterface';
import { DoctorRepositoryFactory } from '../../db/factories/DoctorRepositoryFactory';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../../model/Doctor';
import { SingleDayAvailability } from '../../model/SingleDayAvailability';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorRepository: DoctorRepositoryInterface;
  
  private doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  public doctors$ = this.doctorsSubject.asObservable();

  constructor(doctorRepository: DoctorRepositoryFactory) {
    this.doctorRepository = doctorRepository.getRepository();
    this.initializeDoctors();
  }

  getDoctor = (id: string): Observable<Doctor> => {
    return this.doctorRepository.getDoctorById(id);
  }

  addDoctor = (doctor: Doctor): Observable<any> => {
    return this.doctorRepository.addDoctor(doctor);
  }

  removeDoctor = (id: string): Observable<any> => {
    return this.doctorRepository.removeDoctor(id);
  }

  addAvailability = (id: string, availabilities: SingleDayAvailability[], type: string): Observable<any> => {
    return this.doctorRepository.addDoctorAvailability(id, availabilities, type);
  }

  getAvailability = (id: string, type: string): Observable<SingleDayAvailability[]> => {
    return this.doctorRepository.getDoctorAvailability(id, type);
  }

  private initializeDoctors(): void {
    this.doctorRepository.getDoctors().subscribe({
      next: (doctors) => {
        console.log(doctors);
        this.doctorsSubject.next(doctors);
      },
      error: (err) => console.log(`Failed to retrieve doctors, error: ${err}.`)
    });
  }
}
