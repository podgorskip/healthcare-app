import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { User } from '../../../model/User';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  providers: [CartService, AuthenticationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cartItemsCount: number = 0;
  user: User;

  constructor(private authenticationService: AuthenticationService, private cartService: CartService) { 
    this.user = authenticationService.getAuthenticatedUser;
  }

  ngOnInit(): void {
      if (this.user) {
        this.cartService.cartVisits$.subscribe({
          next: (data) => this.cartItemsCount = data.length ? data.length : 0,
          error: (err) => console.log('Failed to fetch items count, ', err)
        })

      this.cartService.startListeningToCart(this.user.id);
      };
  };
}
