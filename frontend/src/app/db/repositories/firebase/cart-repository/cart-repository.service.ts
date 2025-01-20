import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, push } from 'firebase/database';
import { Observable } from 'rxjs';
import { CartRepositoryInterface } from '../../../interfaces/CartRepositoryInterface';
import { Item } from '../../../../model/Item';
import { Cart } from '../../../../model/Cart';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCartRepository implements CartRepositoryInterface {
  private db: any;
  private dbPath = '/carts'; 

  constructor(firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  // Add an item to the cart
  addItem(id: string, item: Item): Observable<Cart> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}/items`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          const cartItems: Item[] = snapshot.exists() ? snapshot.val() : [];
          // Add the new item to the cart
          cartItems.push(item);
          // Update the cart data in Firebase
          set(cartRef, cartItems)
            .then(() => {
              // Return the updated cart with id and items
              observer.next({ id, items: cartItems });
              observer.complete();
            })
            .catch((error) => {
              observer.error(`Error adding item to cart: ${error}`);
            });
        })
        .catch((error) => {
          observer.error(`Error fetching cart items: ${error}`);
        });
    });
  }

  // Remove an item from the cart
  removeItem(itemId: string): Observable<any> {
    // Get a reference to the cart's items in Firebase
    const cartRef = ref(this.db, `${this.dbPath}/items`);
    return new Observable((observer) => {
      // Retrieve the cart's items from Firebase
      get(cartRef)
        .then((snapshot) => {
          const cartItems: Item[] = snapshot.exists() ? snapshot.val() : [];
          
          // Filter out the item based on the provided itemId
          const updatedCartItems = cartItems.filter((item: Item) => item.id !== itemId);
          
          // Update the cart in Firebase with the new list of items
          set(cartRef, updatedCartItems)
            .then(() => {
              // Return the updated cart items
              observer.next(updatedCartItems);
              observer.complete();
            })
            .catch((error) => {
              observer.error(`Error removing item from cart: ${error}`);
            });
        })
        .catch((error) => {
          observer.error(`Error fetching cart items: ${error}`);
        });
    });
  }

  // Get all items in the cart
  getCart(id: string): Observable<Item[]> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}/items`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const cartItems: Item[] = snapshot.val();
            observer.next(cartItems);  // Return all items in the cart
            observer.complete();
          } else {
            observer.error('Cart not found or empty');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching cart: ${error}`);
        });
    });
  }

  getCartById(id: string): Observable<Cart> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const cart = snapshot.val();
            observer.next(cart);  // Return the full cart data
            observer.complete();
          } else {
            observer.error('Cart not found');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching cart: ${error}`);
        });
    });
  }

  addCart(cart: Cart): Promise<any> {
    const cartRef = ref(this.db, this.dbPath);
    const cartData = {
      id: cart.id,
      items: cart.items || [],
    };

    return new Promise((resolve, reject) => {
        return push(cartRef, cartData)
        .then((ref) => resolve(ref))
        .catch((error) => reject(error));
    });
  }
}
