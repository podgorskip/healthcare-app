import { Injectable, OnInit } from '@angular/core';
import { UserRepositoryInterface } from '../../db/interfaces/UserRepositoryInterface';
import { UserRepositoryFactory } from '../../db/factories/UserRepositoryFactory';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private userRepository: UserRepositoryInterface;
  users$ = this.usersSubject.asObservable();

  constructor(userRepository: UserRepositoryFactory) { 
    this.userRepository = userRepository.getRepository();
    this.initializeDoctors();
  }

  getUsers(): Observable<User[]> {
    return this.userRepository.getUsers();
  }

  toggleUserBan(id: string): Observable<any> {
    return this.userRepository.toggleUserBan(id);
  }

  private initializeDoctors(): void {
    this.userRepository.getUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.usersSubject.next(users);
      },
      error: (err) => console.log(`Failed to retrieve users, error: ${err}.`)
    });
  }
}
