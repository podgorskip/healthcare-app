import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRepositoryFactory } from '../../db/factories/PatientRepositoryFactory';
import { PatientRepositoryInterface } from '../../db/interfaces/PatientRepositoryInterface';
import { Patient } from '../../model/Patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientRepository: PatientRepositoryInterface;

  constructor(patientRepository: PatientRepositoryFactory) {
    this.patientRepository = patientRepository.getRepository();
  }

  addPatient = (patient: Patient): Observable<Patient> => {
    return this.patientRepository.addPatient(patient);
  }

  getPatientById = (id: string): Observable<Patient> => {
    return this.patientRepository.getPatientById(id);
  }
}
