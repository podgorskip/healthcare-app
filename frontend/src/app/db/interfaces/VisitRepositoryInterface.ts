import { Observable } from 'rxjs';
import { ScheduledVisit } from '../../model/ScheduledVisit';

export interface VisitRepositoryInterface {
  getPatientVisits(id: string): Observable<ScheduledVisit[]>;

  getDoctorVisits(id: string): Observable<ScheduledVisit[]>;

  addVisit(visit: ScheduledVisit): Observable<ScheduledVisit>;

  cancelVisit(id: string): Observable<ScheduledVisit>;

  deleteVisit(id: string): Observable<string>;
}
