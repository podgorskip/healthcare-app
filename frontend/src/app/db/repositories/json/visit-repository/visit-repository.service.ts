// import { Injectable } from '@angular/core';
// import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
// import { firstValueFrom } from 'rxjs';
// import { ScheduledVisit } from '../../../../model/ScheduledVisit';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class JsonVisitRepository implements VisitRepositoryInterface {
//   private apiUrl = `${environment.jsonConfig.baseUrl}/scheduledVisits`;

//   constructor(private http: HttpClient) {}

//   listenToScheduledVisitUpdates(callback: (visits: ScheduledVisit[]) => void): void {
//     console.log('.listenToScheduledVisitUpdates - invoked');

//     const func = async () => {
//       try {
//         const response = await fetch(`${this.apiUrl}`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch scheduled visits`);
//         }
//         const data: Record<string, ScheduledVisit> = await response.json();

//         const visits: ScheduledVisit[] = Object.values(data).map((visit: ScheduledVisit) => ({
//           id: visit.id,
//           details: visit.details,
//           type: visit.type,
//           price: visit.price,
//           firstName: visit.firstName,
//           lastName: visit.lastName,
//           username: visit.username,
//           sex: visit.sex,
//           age: visit.age,
//           date: visit.date.map((entry) => ({
//             day: new Date(entry.day),
//             hour: entry.hour,
//           })),
//           cancelled: visit.cancelled
//         }));

//         callback(visits);
//       } catch (error) {
//         console.error('Error:', error);
//         callback([]);
//       }
//     };

//     func();
//   }

//   async removeScheduledVisit(idToRemove: string): Promise<void> {
//     console.log('.deleteAndPostFilteredVisits - invoked');
  
//     try {
//       const visits: ScheduledVisit[] = await firstValueFrom(this.http.get<ScheduledVisit[]>(`${this.apiUrl}`));
  
//       const updatedVisits = visits.filter(visit => visit.id !== idToRemove);
  
//       await firstValueFrom(this.http.delete(`${this.apiUrl}`));
  
//       const visitsWithTimestamps = updatedVisits.map(visit => ({
//         ...visit,
//         date: visit.date.map(d => ({
//           day: d.day instanceof Date ? d.day.getTime() : d.day,
//           hour: d.hour,
//         }))
//       }));


//       const postRequests = visitsWithTimestamps.map(visit => {
//         return firstValueFrom(this.http.post(`${this.apiUrl}`, visit));
//       });
  
//       await Promise.all(postRequests);
//       console.log('Visit removed and filtered visits posted successfully.');
  
//     } catch (error) {
//       console.error('Error occurred during the API call:', error);
//       throw error;
//     }
//   }
  

//   async addScheduledVisit(visit: ScheduledVisit): Promise<string> {
//     console.log('.addScheduledVisit - invoked');
  
//     try {
//       let visits: ScheduledVisit[] = await firstValueFrom(
//         this.http.get<ScheduledVisit[]>(`${this.apiUrl}`)
//       );
  
//       if (!visits) {
//         visits = [];
//       }
  
//       const newVisitId = String(visits.length + 1);
//       visit.id = newVisitId;
  
//       const updatedVisit = {
//         ...visit,
//         date: visit.date.map((d) => ({
//           day: d.day instanceof Date ? d.day.getTime() : d.day,
//           hour: d.hour,
//         }))
//       };
  
//       await firstValueFrom(this.http.post(`${this.apiUrl}`, updatedVisit));
  
//       return newVisitId;
//     } catch (error) {
//       console.error('Error occurred during the API call:', error);
//       throw error;
//     }
//   }
  

//   async getScheduledVisitById(visitId: string): Promise<ScheduledVisit> {
//     console.log(`.getScheduledVisitById - invoked, visit id=${visitId}`);
  
//     try {
//       const visits: ScheduledVisit[] = await firstValueFrom(this.http.get<ScheduledVisit[]>(`${this.apiUrl}`));
//       const visit = visits.find(v => v.id === visitId);  
  
//       if (visit) {
//         return {
//           id: visit.id,
//           details: visit.details,
//           type: visit.type,
//           price: visit.price,
//           firstName: visit.firstName || '',
//           lastName: visit.lastName || '',
//           username: visit.username || '',
//           sex: visit.sex || '',
//           age: visit.age || 0,
//           date: visit.date.map((entry: { day: Date, hour: number }) => ({
//             day: new Date(entry.day),
//             hour: entry.hour,
//           })),
//           cancelled: visit.cancelled,
//         };
//       } else {
//         throw new Error(`Scheduled visit with ID ${visitId} not found`);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   } 

//   async updateVisitData(visits: ScheduledVisit[], updatedVisit: ScheduledVisit): Promise<ScheduledVisit[]> {
//     updatedVisit.date = updatedVisit.date.map((entry: { day: Date, hour: number }) => ({
//       day: new Date(entry.day),
//       hour: entry.hour,
//     }));

//     const updatedVisits = visits.map(visit =>
//       visit.id === updatedVisit.id ? { ...visit, ...updatedVisit } : visit
//     );
    
//     return updatedVisits;
//   }

//   async updateVisit(visit: ScheduledVisit): Promise<void> {
//     console.log(`.updateVisit - invoked, visit id=${visit.id}`);

//     try {
//       const visits: ScheduledVisit[] = await firstValueFrom(this.http.get<ScheduledVisit[]>(`${this.apiUrl}`));

//       const curVisit = visits.find(v => v.id === visit.id);  

//       if (!curVisit) {
//         throw new Error(`Scheduled visit with ID ${visit.id} not found`);
//       }

//       const updatedVisits = await this.updateVisitData(visits, visit);
//       const visitsWithTimestamps = Object.values(updatedVisits).map(v => ({
//         ...v,
//         date: v.date.map(d => ({
//           day: d.day instanceof Date ? d.day.getTime() : d.day,
//           hour: d.hour
//         }))
//       }));

//       console.log(visitsWithTimestamps)

//       await firstValueFrom(this.http.put(`${this.apiUrl}`, visitsWithTimestamps));
//     } catch (error) {
//       console.error('Error updating visit:', error);
//       throw error;
//     }
//   }
// }
