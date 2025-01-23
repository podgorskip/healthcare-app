import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { NgFor, NgIf } from '@angular/common';
import { DateUtils } from '../../../utils/DateUtils';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { VisitService } from '../../../services/visit/visit.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Item } from '../../../model/Item';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { Patient } from '../../../model/Patient';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentComponent } from '../../payment/payment.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, PaymentComponent],
  providers: [CartService, VisitService, PatientService],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  
  isConfirmingPayment: boolean = false;
  patient!: Patient;
  selectedItems: Item[] = [];

  constructor(
    private cartService: CartService, 
    private userIdentityInfo: UserIdentityInfo,
    private visitService: VisitService,
    private patientService: PatientService,
    private router: Router
  ) { }

  formatDates = (dates: { day: Date, hour: number }[]): string => {
    console.log(dates)
    return DateUtils.formatSelectedDays(dates);
  }

  addItem = (id: string) => {
    if (this.selectedItems.some(item => item.id === id)) {
      this.selectedItems = this.selectedItems.filter(item => item.id !== id);
    } else {
      const item = this.patient.cart?.items?.find(v => v.id === id);
      if (item) {
        this.selectedItems.push(item);
      } else {
        console.warn(this.patient.cart ? `Item with id ${id} not found` : 'Cart is not initialized');
      }
    }
  };

  get totalPrice(): number {
    return this.selectedItems.reduce((total, item) => total + (50 * item.date.length), 0); 
  }

  onClickCard = (): void => {
    this.isConfirmingPayment = true;
  }

  finalizePayment() {
    console.log('Finalizing payment...');
    this.selectedItems.forEach((item) => {
      this.cartService.removeItem(item.id).subscribe({
        next: (response) => console.log(`Item removed: ${response}`),
        error: (err) => console.error('Error:', err),
      });
  
      const visit: ScheduledVisit = {
        id: '',
        date: item.date,
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username,
        age: item.age,
        sex: item.sex,
        details: item.details,
        price: item.price,
        doctor: item.doctor,
        type: item.type,
        cancelled: false,
        patient: this.patient,
        reviewed: false,
      };
  
      this.visitService.addVisit(visit).subscribe({
        next: (response) => {
          console.log(`Visit scheduled: ${response}`);
          this.router.navigate(['/patient-dashboard']);
        },
        error: (err) => console.error('Error scheduling visit:', err),
      });
    });
  
    this.isConfirmingPayment = false;
  }  

  onRemoveFromCart = (id: string): void => {
    const userChoice = confirm('Do you want to delete visit from cart?');
    if (!userChoice) return;

    this.cartService.removeItem(id).subscribe({
      next: (response) => console.log(`Response: ${response}`),
      error: (err) => console.error('Error removing item from cart:', err)
    });
  };

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => {
        if (user) {
          this.patientService.getPatientById(user.id).subscribe({
            next: (patient) => {
              console.log(patient)
              this.patient = patient
            }
          })
        }
      },
      error: (err) => console.error('Error with user info:', err)
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
