import { Component } from '@angular/core';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { FormsModule } from '@angular/forms';
import { Authentication } from '../../../model/Authentication';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authentication: Authentication = {
    username: '',
    password: ''
  }

  constructor(private auth: AuthenticationService) { }

  submit = (): void => {
    this.auth.authenticationService.authenticate(this.authentication);
  }
}
