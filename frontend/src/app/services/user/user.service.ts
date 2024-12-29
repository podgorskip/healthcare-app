import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { UserRepositoryInterface } from '../../db/interfaces/UserRepositoryInterface';
import { UserRepositoryFactory } from '../../db/factories/UserRepositoryFactory';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRepository: UserRepositoryInterface;
  private scheduledVisitSubject = new BehaviorSubject<string[]>([]); 

  constructor(userRepository: UserRepositoryFactory) {
    this.userRepository = userRepository.getRepository();
  }

  get scheduledVisits$() {
    return this.scheduledVisitSubject.asObservable();
  }

  async addUser(user: User): Promise<void> {
    console.log(`.addUser - invoked`);

    try {
      await this.userRepository.addUser(user);  
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async addScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.addScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);

    try {
      await this.userRepository.addScheduledVisit(userId, visitId);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async removeVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.removeVisit - invoked, user id=${userId}, visit id=${visitId}`);

    try {
      await this.userRepository.removeScheduledVisit(userId, visitId);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  startListeningScheduledVisits(userId: string): void {
    this.userRepository.listenToScheduledVisitUpdates(userId, (visits: string[]) => {
      this.scheduledVisitSubject.next(visits); 
    });
  }
}
