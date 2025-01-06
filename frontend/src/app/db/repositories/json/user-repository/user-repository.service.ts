import { Injectable } from '@angular/core';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../../model/User';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';

@Injectable({
  providedIn: 'root'
})
export class JsonUserRepository implements UserRepositoryInterface {
  private apiUrl = `${environment.jsonConfig.baseUrl}/users`;

  constructor(private http: HttpClient) { }

  listenToScheduledVisitUpdates(userId: string, callback: (visits: string[]) => void): void {
    console.log(`.listenToScheduledVisitUpdates - invoked, user id=${userId}`);
    
    this.http.get<any>(`${this.apiUrl}`)
      .subscribe({
          next: (users: any) => {
              const user = users[userId];
              if (user && user.scheduledVisits) {
                  callback(user.scheduledVisits);
              } else {
                  callback([]);
              }
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
        const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
        const user = users[userId];

        if (!user || !Array.isArray(user.scheduledVisits)) {
            console.warn('Unexpected response format or no scheduled visits for user');
            return [];
        }

        console.log(`Scheduled visits retrieved for user ${userId}: ${user.scheduledVisits}`);
        return user.scheduledVisits;
    } catch (error) {
        console.error('Error fetching scheduled visits:', error);
        return [];
    }
  }

  async addScheduledVisit(userId: string, visitId: string): Promise<any> {
    console.log(`.addScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);
    
    try {
        const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
        const user = users[userId];

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        if (!user.scheduledVisits) {
            user.scheduledVisits = [];
        }
        user.scheduledVisits.push(visitId);
        users[userId] = user;

        return firstValueFrom(this.http.put(`${this.apiUrl}`, users));
      } catch (error) {
        console.error('Error adding scheduled visit:', error);
        throw error;
    }
  }

  async removeScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);
  
    try {
      const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
      
      const user = users[userId];
  
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      user.scheduledVisits = user.scheduledVisits.filter((id: string) => id !== visitId);
  
      users[userId] = user;
  
      await firstValueFrom(this.http.put(`${this.apiUrl}`, users));
  
      console.log(`Scheduled visit with id=${visitId} removed for user id=${userId}`);
    } catch (error) {
      console.error('Error removing scheduled visit:', error);
      throw error;
    }
  }

  async addUser(user: User): Promise<any> {
    console.log(`.addUser - invoked`);
    return this.http.post(`${this.apiUrl}`, user); 
  }

  async removeFromCart(userId: string, visitId: string): Promise<any> {
    console.log(`.removeFromCart - invoked, user id=${userId}, visit id=${visitId}`);
    
    try {
      const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
      
      const user = users[userId];
  
      if (!user || !Array.isArray(user.cart)) {
        throw new Error(`User or cart not found for user ${userId}`);
      }
  
      user.cart = user.cart.filter((visit: ScheduledVisit) => visit.id !== visitId);
  
      users[userId] = user;
  
      return firstValueFrom(this.http.put(`${this.apiUrl}`, users));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
  

  async addToCart(userId: string, visit: ScheduledVisit): Promise<any> {
    console.log(`.addToCart - invoked, user id=${userId}`);
    
    try {
      const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
      
      const user = users[userId];
  
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      if (!user.cart) {
        user.cart = [];
      }
  
      visit.id = user.cart.length + 1;
      user.cart.push(visit);
      users[userId] = user;
  
      return firstValueFrom(this.http.put(`${this.apiUrl}`, users));
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
  
  listenToCartUpdates(userId: string, callback: (visits: ScheduledVisit[]) => void): void {
    console.log(`.listenToCartUpdates - invoked, user id=${userId}`);
    
    const fun = async () => {
      try {
        const users: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
        const user = users[userId];

        if (!user || !user.cart) {
            callback([]); 
            return;
        }

        const cart: ScheduledVisit[] = Object.values(user.cart);

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
