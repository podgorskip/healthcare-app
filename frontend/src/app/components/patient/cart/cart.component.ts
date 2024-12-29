import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { User } from '../../../model/User';
import { NgFor, NgIf } from '@angular/common';
import { DateUtils } from '../../../utils/DateUtils';
import { ScheduledVisitService } from '../../../services/scheduled-visit/scheduled-visit.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MongoVisitRepository } from '../../../db/repositories/mongo/visit-repository/visit-repository.service';
import { UserService } from '../../../services/user/user.service';
import { MongoUserRepository } from '../../../db/repositories/mongo/user-repository/mongo-user-repository.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule],
  providers: [CartService, ScheduledVisitService, MongoVisitRepository, UserService, MongoUserRepository],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartVisits: ScheduledVisit[] = [];
  user: User;
  selectedVisits: ScheduledVisit[] = [];

  constructor(
      private cartService: CartService, 
      private authenticationService: AuthenticationService,
      private scheduledVisitService: ScheduledVisitService,
      private userService: UserService,
      private router: Router
  ) { 
    this.user = this.authenticationService.getAuthenticatedUser;
  }

  formatDates = (dates: { day: Date, hour: number }[]): string => {
    return DateUtils.formatSelectedDays(dates);
  }

  addItem = (id: string) => {
    if (this.selectedVisits.some(v => v.id === id)) {
      this.selectedVisits = this.selectedVisits.filter(v => v.id !== id);
    } else {
      let item = this.cartVisits.find(v => v.id === id);
      item ?  this.selectedVisits.push(item) : null;
    }
  }

  get totalPrice(): number {
    return this.selectedVisits.reduce((total, visit) => total + 50 * visit.date.length, 0); 
  }

  onClickCard = (): void => {
    console.log('.onClickCard - invoked');
  
    this.selectedVisits.forEach(visit => {
      visit.price = visit.date.length * 50;

      this.cartService.removeVisitFromCart(this.user.id, visit.id)
        .catch(err => console.log(err));

      this.scheduledVisitService.addVisit(visit)
        .then((visitId) => {
          this.userService.addScheduledVisit(this.user.id, visitId)
          .then((id) => {
            console.log('Successfully added visit, id=', id);
            this.router.navigate(['/patient-dashboard']);
          })
          .catch(err => console.log('Error: ', err));
        })
        .catch((err) => console.log('Error: ', err));
    })
  }

  onRemoveFromCart = (id: string): void => {
    const userChoice = confirm('Do you want to delete visit from cart?');

    if (!userChoice) return;
    
    this.cartService.removeVisitFromCart(this.user.id, id)
      .then(() => console.log('Removed visit from cart, id=', id))
      .catch((err) => console.log(`Failed to remove visit of id: ${id}, `, err))
  };

  ngOnInit(): void {
      this.cartService.cartVisits$.subscribe((visits) => {
        this.cartVisits = visits;
        console.log('vis, ', this.cartVisits)
      });

      this.cartService.startListeningToCart(this.user.id);
  };
}
