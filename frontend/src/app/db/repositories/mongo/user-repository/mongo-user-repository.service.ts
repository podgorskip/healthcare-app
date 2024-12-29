import { ScheduledVisit } from './../../../../model/ScheduledVisit';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongoUserRepository implements UserRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/users`;

  constructor(private http: HttpClient) { }

  listenToScheduledVisitUpdates(userId: string, callback: (visits: string[]) => void): void {
    console.log(`.listenToScheduledVisitUpdates - invoked, user id=${userId}`);
    
    this.http.get<string[]>(`${this.apiUrl}/${userId}/scheduled`)
      .subscribe({
          next: (visitIds: string[]) => {
            console.log('got: ', visitIds)
              if (!visitIds || visitIds.length === 0) {
                  callback([]); 
                  return;
              }
              callback(visitIds);
          },
          error: (error) => {
              console.error('Error fetching scheduled visits:', error);
              callback([]);
          }
      });
  }

  async getScheduledVisits(userId: string): Promise<string[]> {
    console.log(`.getScheduledVisits - invoked, user id=${userId}`);
    
    try {
        const visitIds = await this.http.get<string[]>(`${this.apiUrl}/${userId}/scheduled`).toPromise();
        
        if (!Array.isArray(visitIds)) {
            console.warn('Unexpected response format: visitIds is not an array');
            return []; 
        }

        console.log(`Scheduled visits retrieved: ${visitIds}`);
        return visitIds;
    } catch (error) {
        console.error('Error fetching scheduled visits:', error);
        return []; 
    }
  }

  async addScheduledVisit(userId: string, visitId: string): Promise<any> {
    console.log(`.addScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);
    return firstValueFrom(this.http.post<string>(`${this.apiUrl}/${userId}/scheduled`, {'visitId': visitId}));
  }

  async removeScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);
    this.http.delete(`${this.apiUrl}/${userId}/scheduled/${visitId}`);
  }

  async addUser(user: User): Promise<any> {
    console.log(`.addUser - invoked`);
    return this.http.post(`${this.apiUrl}`, user); 
  }

  async removeFromCart(userId: string, visitId: string): Promise<any> {
    console.log(`.removeFromCart - invoked, user id=${userId}, visit id=${visitId}`);
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${userId}/cart/${visitId}`));
  }

  async addToCart(userId: string, visit: ScheduledVisit): Promise<any> {
    console.log(`.addToCart - invoked, user id=${userId}`);
    return firstValueFrom(this.http.post(`${this.apiUrl}/${userId}/cart`, visit));
  }

  listenToCartUpdates(userId: string, callback: (visits: ScheduledVisit[]) => void): void {
    console.log(`.listenToCartUpdates - invoked, user id=${userId}`);
    
    const fun = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/${userId}/cart`);
        if (!response.ok) {
          throw new Error(`Failed to fetch cart for user ${userId}`);
        }
        const cart: ScheduledVisit[] = await response.json();

        console.log(cart)
  
        cart.forEach(visit => {
          if (visit.date && visit.date.length > 0) {
            visit.date.forEach(dateObj => {
              dateObj.day = new Date(dateObj.day);
            });
          }
        });
  
        callback(cart);
      } catch (error) {
        console.error('Error fetching cart updates:', error);
        callback([]); 
      }
    };

    fun();
  }
}
