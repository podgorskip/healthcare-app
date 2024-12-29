import { Injectable } from '@angular/core';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { BehaviorSubject } from 'rxjs';
import { UserRepositoryFactory } from '../../db/factories/UserRepositoryFactory';
import { UserRepositoryInterface } from '../../db/interfaces/UserRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private userRepository: UserRepositoryInterface;
  private cartSubject = new BehaviorSubject<ScheduledVisit[]>([]); // Holds cart data

  constructor(userRepository: UserRepositoryFactory ) {
    this.userRepository = userRepository.getRepository();
  }

  get cartVisits$() {
    return this.cartSubject.asObservable();
  }

  async addVisitToCart(userId: string, visit: ScheduledVisit): Promise<void> {
    try {
      await this.userRepository.addToCart(userId, visit);
    } catch (error) {
      console.error('Error adding scheduled visit:', error);
    }
  }

  async removeVisitFromCart(userId: string, visitId: string): Promise<void> {
    try {
      console.log("Deleting from cart: ", visitId);
      const response = await this.userRepository.removeFromCart(userId, visitId);
      console.log(response)
    } catch (error) {
      console.error('Error adding scheduled visit:', error);
    }
  }

  startListeningToCart(userId: string): void {
    this.userRepository.listenToCartUpdates(userId, (cartVisits: ScheduledVisit[]) => {
      this.cartSubject.next(cartVisits); 
    });
  }
}
