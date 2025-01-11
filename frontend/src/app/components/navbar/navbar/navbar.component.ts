import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { User } from '../../../model/User';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { CommonModule, NgIf } from '@angular/common';
import { Role } from '../../../model/enum/Role';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, CommonModule],
  providers: [CartService, AuthenticationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cartItemsCount: number = 0;
  authenticatedUser?: User;

  roles: { [key: number]: Role } = {
    1: Role.ADMIN,
    2: Role.DOCTOR,
    3: Role.PATIENT,
  };
  
  constructor(private userIdentityInfo: UserIdentityInfo, private cartService: CartService) { }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$.subscribe({
      next: (user) => {

        if (user) {
          console.log('Authenticated user: ', this.authenticatedUser)
          this.authenticatedUser = user;

          if (this.authenticatedUser) {
            this.cartService.cartVisits$.subscribe({
              next: (data) => this.cartItemsCount = data.length ? data.length : 0,
              error: (err) => console.log('Failed to fetch items count, ', err)
            })
    
          this.cartService.startListeningToCart(this.authenticatedUser.id);
          };
        }
      }
    })
  };

  isAuthenticated = (): boolean => {
    return this.authenticatedUser !== undefined;
  }

  hasAccess = (role: Role): boolean => {
    return Number(this.authenticatedUser?.role) === role;
  }
}
