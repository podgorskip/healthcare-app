import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  @Output() paymentComplete = new EventEmitter<void>();

  cardNumber = '';
  salt = '';
  isProcessingPayment = false;

  submitPayment() {
    this.isProcessingPayment = true;
    setTimeout(() => {
      this.isProcessingPayment = false;
      this.paymentComplete.emit();
    }, 2000); 
  }
}