import { Component } from '@angular/core';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Authentication } from '../../../model/Authentication';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthenticationService, private router: Router) { }

  submit = (form: NgForm): void => {
    this.auth.authenticate(this.authentication).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/doctors']);
        } else {
          this.resetForm(form);
          alert('Authentication failed. Please, try again.');
        }
      }
    })
  }

  private resetForm(form: NgForm): void {
    form.resetForm(); 
    this.authentication = { username: '', password: '' }; 
  }
}
