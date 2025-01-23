import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserIdentityInfo {
  private _authenticatedUserSubject = new BehaviorSubject<User | null>(null);
  public authenticatedUser$: Observable<User | null> = this._authenticatedUserSubject.asObservable();

  setAuthenticatedUser(user: User | null) {
    if (user) {
      this._authenticatedUserSubject.next(user);
    } else {
      console.log('Logging out...');
      this._authenticatedUserSubject.next(null);
    }
  }
}
