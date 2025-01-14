import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepositoryInterface } from '../../db/interfaces/CartRepositoryInterface';
import { CartRepositoryFactory } from '../../db/factories/CartRepositoryFactory';
import { Item } from '../../model/Item';
import { Cart } from '../../model/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartRepository: CartRepositoryInterface;

  constructor(cartRepository: CartRepositoryFactory) {
    this.cartRepository = cartRepository.getRepository();
  }

  addItem = (id: string, item: Item): Observable<Cart> => {
    return this.cartRepository.addItem(id, item);
  }

  removeItem = (id: string): Observable<Cart> => {
    return this.cartRepository.removeItem(id);
  }

  getCart = (id: string): Observable<Cart> => {
    return this.cartRepository.getCart(id);

  }
}
