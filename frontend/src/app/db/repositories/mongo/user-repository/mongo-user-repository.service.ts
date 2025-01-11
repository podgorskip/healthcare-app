import { ScheduledVisit } from './../../../../model/ScheduledVisit';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';

@Injectable({
  providedIn: 'root'
})
export class MongoUserRepository implements UserRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/users`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) { }

  listenToScheduledVisitUpdates(userId: string, callback: (visits: string[]) => void): void {
    console.log(`.listenToScheduledVisitUpdates - invoked, user id=${userId}`);
    
    const headers = this.auth.authHeaders();
    this.http.get<string[]>(`${this.apiUrl}/${userId}/scheduled`, { headers })
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
      const headers = this.auth.authHeaders();
      const visitIds = await this.http.get<string[]>(`${this.apiUrl}/${userId}/scheduled`, { headers }).toPromise();
        
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
    const headers = this.auth.authHeaders();
    return firstValueFrom(this.http.post<string>(`${this.apiUrl}/${userId}/scheduled`, {'visitId': visitId}, { headers }));
  }

  async removeScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);
    const headers = this.auth.authHeaders();
    const response = firstValueFrom(this.http.delete(`${this.apiUrl}/${userId}/scheduled/${visitId}`, { headers }));
    console.log('Server response: ', response);
  }

  async addUser(user: User): Promise<any> {
    console.log(`.addUser - invoked`);
    return this.http.post(`${this.apiUrl}`, user); 
  }

  async removeFromCart(userId: string, visitId: string): Promise<any> {
    console.log(`.removeFromCart - invoked, user id=${userId}, visit id=${visitId}`);
    const headers = this.auth.authHeaders();
    return firstValueFrom(this.http.delete(`${this.apiUrl}/${userId}/cart/${visitId}`, { headers }));
  }

  async addToCart(userId: string, visit: ScheduledVisit): Promise<any> {
    console.log(`.addToCart - invoked, user id=${userId}`);
    const headers = this.auth.authHeaders();
    return firstValueFrom(this.http.post(`${this.apiUrl}/${userId}/cart`, visit, { headers }));
  }

  listenToCartUpdates(userId: string, callback: (visits: ScheduledVisit[]) => void): void {
    console.log(`.listenToCartUpdates - invoked, user id=${userId}`);
  
    const fetchCart = async () => {
      try {
        const headers = this.auth.authHeaders(); 
        const url = `${this.apiUrl}/${userId}/cart`;
        console.log(`Fetching cart from URL: ${url}`);
  
        const cart: ScheduledVisit[] = await firstValueFrom(this.http.get<ScheduledVisit[]>(url, { headers }));
  
        cart.forEach((visit) => {
          if (visit.date && Array.isArray(visit.date)) {
            visit.date.forEach((dateObj) => {
              if (dateObj?.day) {
                dateObj.day = new Date(dateObj.day);
              }
            });
          }
        });
  
        callback(cart); 
      } catch (error) {
        console.error('Error fetching cart updates:', error);
        callback([]); 
      }
    };
  
    fetchCart(); 
  }
}
