// import { SingleDayAvailability } from './../../../../model/SingleDayAvailability';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, firstValueFrom } from 'rxjs';
// import { environment } from '../../../../../environments/environment';
// import { AvailabilityRepositoryInterface } from '../../../interfaces/AvailabilityRepositoryInterface';

// @Injectable({
//   providedIn: 'root'
// })
// export class JsonAvailabilityRepository implements AvailabilityRepositoryInterface {
//   private apiUrl = `${environment.jsonConfig.baseUrl}/availability`;

//   constructor(private http: HttpClient) {}

//   async getAvailability(type: string): Promise<SingleDayAvailability[]> {
//     console.log(`.getAvailability - invoked, type=${type}`)

//     return new Promise<SingleDayAvailability[]>((resolve, reject) => {
//       this.http.get<{ absence: SingleDayAvailability[], presence: SingleDayAvailability[] }>(`${this.apiUrl}`)
//         .subscribe({
//           next: (data) => {
//             if (type === 'presence') {
//               resolve(data.presence); 
//             } else if (type === 'absence') {
//               resolve(data.absence); 
//             } else {
//               reject(new Error('Invalid type specified'));
//             }
//           },
//           error: (err) => {
//             console.error('Error fetching data', err);
//             reject(err); 
//           }
//         });
//     });
//   }
  
//   async addAvailability(availabilities: SingleDayAvailability[], type: string): Promise<any> {
//     console.log(`.addAvailability - invoked, type=${type}`);

//     try {
//       const data: any = await firstValueFrom(this.http.get<any>(`${this.apiUrl}`));
  
      
//       if (type === 'presence') {
//         data.presence = availabilities; 
//       } else if (type === 'absence') {
//         data.absence = availabilities; 
//       }
  
//       await firstValueFrom(this.http.put(`${this.apiUrl}`, data));
  
//       return data; 
//     } catch (error) {
//       console.error('Error adding availability:', error);
//       throw error; 
//     }
//   }
  
//   listenToAvailability(type: string, callback: (visits: SingleDayAvailability[]) => void): void {
//     console.log(`.listenToAvailability - invoked, type=${type}`);
    
//     const fun = async () => {
//       try {
//         this.http.get<{ absence: SingleDayAvailability[], presence: SingleDayAvailability[] }>(`${this.apiUrl}`)
//         .subscribe({
//           next: (data) => {
//             if (type === 'presence') {
//               callback(data.presence);
//             } else if (type === 'absence') {
//               callback(data.absence);
//             } 
//           },
//           error: (err) => {
//             console.error('Error fetching data', err);
//           }
//         });
//         } catch (error) {
//         console.error('Error fetching cart updates:', error);
//         callback([]); 
//       }
//     };

//     fun();
//   }
// }
