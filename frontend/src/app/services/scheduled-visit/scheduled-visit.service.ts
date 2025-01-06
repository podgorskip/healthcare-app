import { Injectable } from '@angular/core';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { BehaviorSubject } from 'rxjs';
import { VisitRepositoryInterface } from '../../db/interfaces/VisitRepositoryInterface';
import { VisitRepositoryFactory } from '../../db/factories/VisitRepositoryFactory';
import { UserRepositoryFactory } from '../../db/factories/UserRepositoryFactory';
import { UserRepositoryInterface } from '../../db/interfaces/UserRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class ScheduledVisitService {
  private visitRepository: VisitRepositoryInterface;
  private userRepository: UserRepositoryInterface;
  private scheduledVisitSubject = new BehaviorSubject<ScheduledVisit[]>([]); 

  constructor(
    userRepository : UserRepositoryFactory, 
    visitRepository: VisitRepositoryFactory
  ) { 
    this.visitRepository = visitRepository.getRepository();
    this.userRepository = userRepository.getRepository();
  }

  get scheduledVisits$() {
    return this.scheduledVisitSubject.asObservable();
  }

  async addVisit( visit: ScheduledVisit): Promise<string> {
    console.log(`.addVisit - invoked`);

    try {
      return await this.visitRepository.addScheduledVisit(visit);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to add scheduled visit'); 
    }
  }

  async removeVisit(visitId: string): Promise<void> {
    console.log(`.removeVisit - invoked, visit id=${visitId}`);

    try {
      const response = await this.visitRepository.removeScheduledVisit(visitId);
      console.log(response)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getById(visitId: string): Promise<ScheduledVisit> {
    console.log(`.getById - invoked, visit id=${visitId}`);

    return this.visitRepository.getScheduledVisitById(visitId);
  }

  async updateVisit(visit: ScheduledVisit): Promise<void> {
    console.log(`.updateVisit - invoked, visit id=${visit.id}`);

    this.visitRepository.updateVisit(visit);
  }

  startListeningToScheduledVisits(): void {
    console.log(`.startListeningToScheduledVisits - invoked`);

    this.visitRepository.listenToScheduledVisitUpdates((visits: ScheduledVisit[]) => {
      this.scheduledVisitSubject.next(visits); 
    });
  }
}
