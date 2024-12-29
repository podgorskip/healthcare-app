import { ScheduledVisit } from './../../../../model/ScheduledVisit';
import { environment } from './../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, DataSnapshot, push, onValue, get, remove } from 'firebase/database';
import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
import { User } from '../../../../model/User';

@Injectable({
  providedIn: 'root'
})
export class FirebaseVisitRepository implements VisitRepositoryInterface {
  private db: any;
  private dbPath = '/scheduledVisits'; 

  constructor() { 
    const firebaseApp = initializeApp(environment.firebaseConfig);
    this.db = getDatabase(firebaseApp); 
  }

  listenToScheduledVisitUpdates(callback: (visits: ScheduledVisit[]) => void): void {
    console.log('.listenToScheduledVisitUpdates - invoked');
    
    const cartRef = ref(this.db, `${this.dbPath}`);
    onValue(cartRef, (snapshot: DataSnapshot) => {
      const cartData = snapshot.val();
  
      const cartArray = cartData
        ? Object.keys(cartData).map((key) => {
            const visit = cartData[key];
  
            const updatedVisit = {
              id: key,
              ...visit,
              date: visit.date
                ? visit.date.map((i: any) => ({
                    day: new Date(i.day), 
                    hour: i.hour,
                  }))
                : [],
            };
  
            return updatedVisit;
          })
        : [];
  
      callback(cartArray);
    });
  }

  async removeScheduledVisit(id: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, visit id=${id}`);
    
    const usersRef = ref(this.db, '/users');
    const usersSnapshot = await get(usersRef);
    const usersData = usersSnapshot.val();
  
    if (usersData) {
      for (const [userId, user] of Object.entries(usersData)) {
        const user = usersData[userId] as User;
        if (user.scheduledVisits && user.scheduledVisits.includes(id)) {
          const userRef = ref(this.db, `/users/${userId}/scheduledVisits`);
          const updatedVisits = user.scheduledVisits.filter((visitId: string) => visitId !== id);
  
          await set(userRef, updatedVisits);
        }
      }
    }
  
    const visitRef = ref(this.db, `${this.dbPath}/${id}`);
    await remove(visitRef);
  }

  async addScheduledVisit(visit: ScheduledVisit): Promise<string> {
    console.log('.assignScheduledVisitToUser - invoked');

    try {
      const visitRef = push(ref(this.db, '/scheduledVisits')); 
      visit.id = visitRef.key as string;
  
      const visitWithTimestamp = {
        ...visit,
        date: visit.date.map((i) => ({ day: i.day.getTime(), hour: i.hour })), 
      };
  
      await set(visitRef, visitWithTimestamp);
      return visit.id;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }

  async getScheduledVisitById(id: string): Promise<ScheduledVisit> {
    console.log(`.getScheduledVisitById - invoked for visit ID: ${id}`);
  
    try {
      const visitRef = ref(this.db, `${this.dbPath}/${id}`);
      const snapshot = await get(visitRef);
      
      if (!snapshot.exists()) {
        console.log(id)
        console.log(`Visit with ID ${id} not found.`);
        throw Error('Visit not found.');
      }
  
      const visitData = snapshot.val();
      
      const visit: ScheduledVisit = {
        id: id,
        details: visitData.details,
        price: visitData.price,
        type: visitData.type,
        date: visitData.date
          ? visitData.date.map((i: any) => ({
              day: new Date(i.day), 
              hour: i.hour,
            }))
          : [],
      };
  
      return visit;
    } catch (error) {
      console.error('Error: ', error);
      throw error;
    }
  }
}
