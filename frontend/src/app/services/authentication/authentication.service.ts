import { Injectable } from '@angular/core';
import { User } from '../../model/User';
import { Sex } from '../../model/enum/Sex';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authenticatedUser: User = {
    id: "676eb8cdbb6e6a98e88a5a0e",
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
