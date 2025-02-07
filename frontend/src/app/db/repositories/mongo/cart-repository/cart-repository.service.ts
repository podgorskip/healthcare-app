import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../../../model/Item';
import { Cart } from '../../../../model/Cart';
import { CartRepositoryInterface } from '../../../interfaces/CartRepositoryInterface';
import { WebSocketService } from '../../../../sockets/WebSocketService';

@Injectable({
  providedIn: 'root'
})
export class MongoCartRepository implements CartRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/cart`;

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) { }

  addItem(id: string, item: Item): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${id}`, item);
  }

  removeItem(id: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${id}`);
  }

  getCart(id: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/${id}`);
  }

  startListeningCartUpdate(id: string): Observable<Item[]> {
    console.log(`Started listening to: cart-${id}`);
    return new Observable((observer) => {
      this.webSocketService.listen(`cart-${id}`).subscribe({
        next: (response: { cart: Item[] }) => {
          console.log('WebSocket items update: ', response.cart);
          observer.next(response.cart);
        },
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket subscription completed'),
      });      
    });
  }
}
