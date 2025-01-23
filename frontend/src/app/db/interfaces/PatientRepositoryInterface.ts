import { Observable } from 'rxjs';
import { Patient } from '../../model/Patient';

export interface PatientRepositoryInterface {
  addPatient(patient: Patient): Observable<any>;
  
  getPatientById(id: string): Observable<Patient>;
}
