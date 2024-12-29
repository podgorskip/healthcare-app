import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { Sex } from '../../model/enum/Sex';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticatedUser: User = {
    id: "0",
    firstName: 'Patryk',
    lastName: 'Podgórski',
    username: 'podgorskip',
    sex: Sex.MALE,
    age: 22,
    scheduledVisits: []
  };

  constructor() { }

  get getAuthenticatedUser(): User {
    return this.authenticatedUser;
  }

  
}
