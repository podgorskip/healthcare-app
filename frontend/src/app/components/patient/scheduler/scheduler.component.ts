import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../calendar/calendar.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Sex } from '../../../model/enum/Sex';
import { VisitType } from '../../../model/enum/VisitType';
import { DateUtils } from '../../../utils/DateUtils';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { User } from '../../../model/User';
import { CartService } from '../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  providers: [AuthenticationService, CartService],
  imports: [CalendarComponent, NgIf, NgStyle, FormsModule, NgFor],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent implements OnInit {
  sex: Sex[] = Object.values(Sex);
  availableVisitTypes: VisitType[] = Object.values(VisitType);

  isPopupOpen = false; 
  
  user!: User;
  scheduledVisit: ScheduledVisit = {
    id: '',
    date: [],
    details: '',
    type: null,
    price: 0,
    firstName: '',
    lastName: '',
    username: '',
    sex: Sex.MALE,
    age: 0,
    cancelled: false
  };

  constructor(
    private UserIdentityInfo: UserIdentityInfo, 
    private cartService: CartService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
      this.UserIdentityInfo.authenticatedUser$.subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            this.scheduledVisit.firstName = this.user.firstName;
            this.scheduledVisit.lastName = this.user.lastName;
            this.scheduledVisit.username = this.user.username;
            this.scheduledVisit.sex = this.user.sex;
            this.scheduledVisit.age = this.user.age;
          }
        }
      })
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  handleDateSelection(date: { day: Date, hour: number }[]) {
    this.scheduledVisit.date = date;
    this.closePopup(); 
  }

  sectionStyle = (value: any[]): any => {
    return {
      'color': value.length ? 'black' : 'rgb(190, 190, 190)',
    };
  };

  sectionBorderStyle = (value: any[]): any => {
    return {
      'border': value.length ? '1px solid rgb(45, 45, 45)' : '1px solid rgb(190, 190, 190)',
      'color': value.length ? 'rgb(45, 45, 45)' : 'rgb(190, 190, 190)'
    };
  };

  formatDate = (date: Date) => {
    return DateUtils.formatDayMonth(date);
  }

  formatHour = (hour: number): string => {
    return DateUtils.formatHour(hour);
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.cartService.addVisitToCart(this.user.id, this.scheduledVisit)
        .then(() => this.router.navigate(['/cart']))
        .catch(err => console.log(err));
    } else {
      console.log('Form is invalid');
    }
  }

  formatSelectedDays = (): string => {
    return DateUtils.formatSelectedDays(this.scheduledVisit.date);
  }
}
