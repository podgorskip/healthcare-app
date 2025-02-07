import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, push, onValue } from 'firebase/database';
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

  addItem(id: string, item: Item): Observable<Cart> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}/items`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          const cartItems: Item[] = snapshot.exists() ? snapshot.val() : [];
          cartItems.push(item);
          set(cartRef, cartItems)
            .then(() => {
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

  removeItem(itemId: string): Observable<any> {
    const cartRef = ref(this.db, `${this.dbPath}/items`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          const cartItems: Item[] = snapshot.exists() ? snapshot.val() : [];
          
          const updatedCartItems = cartItems.filter((item: Item) => item.id !== itemId);
          
          set(cartRef, updatedCartItems)
            .then(() => {
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

  getCart(id: string): Observable<Item[]> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}/items`);
    return new Observable((observer) => {
      get(cartRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const cartItems: Item[] = snapshot.val();
            observer.next(cartItems);  
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
            observer.next(cart); 
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

  startListeningCartUpdate(id: string): Observable<Item[]> {
    const cartRef = ref(this.db, `${this.dbPath}/${id}/items`);
    
    return new Observable((observer) => {
      const unsubscribe = onValue(cartRef, (snapshot) => {
        if (snapshot.exists()) {
          observer.next(snapshot.val());
        } else {
          observer.next([]);
        }
      }, (error) => {
        observer.error(`Error listening to cart updates: ${error}`);
      });

      return () => unsubscribe();
    });
  }
}
