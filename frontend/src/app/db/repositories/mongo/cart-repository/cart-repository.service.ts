import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';
import { Observable } from 'rxjs';
import { Item } from '../../../../model/Item';
import { Cart } from '../../../../model/Cart';
import { CartRepositoryInterface } from '../../../interfaces/CartRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class MongoCartRepository implements CartRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/cart`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) { }

  addItem(id: string, item: Item): Observable<Cart> {
    const headers = this.auth.authHeaders();
    return this.http.post<Cart>(`${this.apiUrl}/${id}`, item, { headers });
  }

  removeItem(id: string): Observable<Cart> {
    const headers = this.auth.authHeaders();
    console.log('ID to be removed: ', id)
    return this.http.delete<Cart>(`${this.apiUrl}/${id}`, { headers });
  }

  getCart(id: string): Observable<Cart> {
    const headers = this.auth.authHeaders();
    return this.http.get<Cart>(`${this.apiUrl}/${id}`, { headers });
  }
}
