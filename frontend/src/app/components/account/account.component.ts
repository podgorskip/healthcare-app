import { Component, OnInit } from '@angular/core';
import { User } from '../../model/User';
import { UserIdentityInfo } from '../../authentication/UserIdentityInfo';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  authenticatedUser?: User;

  constructor(private identityInfo: UserIdentityInfo, private userService: UserService) { }

  ngOnInit(): void {
      this.identityInfo.authenticatedUser$.subscribe({
        next: (user) => {
          if (user) {
            this.authenticatedUser = user;
          }
        }
      })
  }
}
