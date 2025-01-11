import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { AvailabilityRepositoryInterface } from '../../../interfaces/AvailabilityRepositoryInterface';
import { HttpClient } from '@angular/common/http';
import { SingleDayAvailability } from '../../../../model/SingleDayAvailability';
import { environment } from '../../../../../environments/environment';
import { MongoAuthenticationService } from '../../../../authentication/mongo/MongoAuthenticationService';

@Injectable({
  providedIn: 'root'
})
export class MongoAvailabilityRepository implements AvailabilityRepositoryInterface {
  private apiUrl = `${environment.mongoConfig.baseUrl}/availability`;

  constructor(private http: HttpClient, private auth: MongoAuthenticationService) { }

  async getAvailability(type: string): Promise<SingleDayAvailability[]> {
    console.log(`.getAvailability - invoked, type=${type}`);

    try {
      const headers = this.auth.authHeaders();
      const response = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/${type}`, { headers }));
      const formattedData = response.flatMap(item => 
        item.availabilities.map((availability: SingleDayAvailability) => ({
            ...availability,
            date: new Date(availability.date).toISOString().split('T')[0] 
        }))
      ) || [];

      return formattedData;
    } catch (error) {
        console.error('Error: ', error);
        throw error; 
    }
  }

  async addAvailability(availabilities: SingleDayAvailability[], type: string): Promise<any> {
    console.log(`.addAvailability - invoked, type=${type}`);
  
    try {
      const headers = this.auth.authHeaders();
      const response = await this.http.post(`${this.apiUrl}/${type}`, availabilities, { headers }).toPromise();
      return response; 
    } catch (error) {
      console.error('Error:', error); 
      throw error; 
    }
  }

  listenToAvailability(type: string, callback: (visits: SingleDayAvailability[]) => void): void {
    console.log(`.listenToAvailability - invoked, type=${type}`);
    
    const fun = async () => {
      try {
        const headers = this.auth.authHeaders();
        const response = await firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/${type}`, { headers }));        
        const formattedData = response.flatMap(item => 
          item.availabilities.map((availability: SingleDayAvailability) => ({
              ...availability,
              date: new Date(availability.date).toISOString().split('T')[0]
          }))
        ) || [];
  
        callback(formattedData);
      } catch (error) {
        console.error('Error fetching cart updates:', error);
        callback([]); 
      }
    };

    fun();
  }
}
