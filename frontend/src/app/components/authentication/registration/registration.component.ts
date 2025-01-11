import { firstValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/User';
import { Sex } from '../../../model/enum/Sex';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Role } from '../../../model/enum/Role';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  providers: [UserService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  sex: Sex[] = Object.values(Sex);
  user: User = {
    id: '',
    role: Role.PATIENT,
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    age: 0,
    sex: Sex.MALE,
  }

  constructor(private userService: UserService) {}

  sectionStyle = (flag: boolean): any => {
    const predicate: boolean = this.overallFilled();
    return {
      'color': predicate || flag ? 'black' : 'rgb(190, 190, 190)',
    };
  };

  sectionBorderStyle = (flag: boolean): any => {
    const predicate: boolean = this.overallFilled();
    return {
      'border': predicate || flag ? '1px solid rgb(45, 45, 45)' : '1px solid rgb(190, 190, 190)',
      'color': predicate || flag ? 'rgb(45, 45, 45)' : 'rgb(190, 190, 190)'
    };
  };

  overallFilled = (): boolean => {
    return (
      this.user.firstName !== '' &&
      this.user.lastName !== '' &&
      this.user.username !== '' &&
      this.user.password !== ''
    );
  };

  submit = (): void => {
    if (this.overallFilled()) {
      this.userService.addUser(this.user)
        .then((data) => console.log(firstValueFrom(data)));
    }
  }
}
