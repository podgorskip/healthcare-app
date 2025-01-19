import { Injectable } from '@angular/core';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { Observable } from 'rxjs';
import { VisitRepositoryInterface } from '../../db/interfaces/VisitRepositoryInterface';
import { VisitRepositoryFactory } from '../../db/factories/VisitRepositoryFactory';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private visitRepository: VisitRepositoryInterface;

  constructor(visitRepository: VisitRepositoryFactory) { 
    this.visitRepository = visitRepository.getRepository();
  }

  addVisit( visit: ScheduledVisit): Observable<ScheduledVisit> {
    console.log(`.addVisit - invoked`);

    try {
      return this.visitRepository.addVisit(visit);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to add scheduled visit'); 
    }
  }

  removeVisit(id: string): Observable<string> {
    console.log(`.removeVisit - invoked, visit id=${id}`);

    try {
      return this.visitRepository.deleteVisit(id);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to remove visit'); 
    }
  }

  getPatientVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getPatientVisits - invoked, visit id=${id}`);
    return this.visitRepository.getPatientVisits(id);
  }

  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    console.log(`.getDoctorVisits - invoked, visit id=${id}`);
    return this.visitRepository.getDoctorVisits(id);
  }

  cancelVisit(id: string): Observable<ScheduledVisit> {
    console.log(`.cancelVisit - invoked, visit id=${id}`);
    return this.visitRepository.cancelVisit(id);
  }

  addVisitReview(review: { score: number, comment: string }, id: string): Observable<any> {
    console.log(`.addVisitReview - invoked, visit id=${id}`);
    return this.visitRepository.addVisitReview(review, id);
  }
}
