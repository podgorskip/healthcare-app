import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, get, set, child, DataSnapshot, push, onValue } from 'firebase/database';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../model/User';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUserRepository implements UserRepositoryInterface {
  private db: any;
  private dbPath = '/users'; 

  constructor() {
    const firebaseApp = initializeApp(environment.firebaseConfig);
    this.db = getDatabase(firebaseApp); 
  }

  listenToScheduledVisitUpdates(userId: string, callback: (visitIds: string[]) => void): void {
    console.log('.listenToScheduledVisitUpdates - invoked');
    
    const visitsRef = ref(this.db, `${this.dbPath}/${userId}/scheduledVisits`);
  
    onValue(visitsRef, (snapshot: DataSnapshot) => {
      const visitIds = snapshot.val();
  
      if (!visitIds) {
        callback([]); 
        return;
      }
  
      const visitIdsArray: string[] = Object.values(visitIds);  
      callback(visitIdsArray); 
    });
  }

  async getScheduledVisits(userId: string): Promise<string[]> {
    console.log('.getScheduledVisits - invoked');

    const visitsRef = ref(this.db, `${this.dbPath}/${userId}/scheduledVisits`);
    
    try {
        const snapshot = await get(visitsRef); 
        const visitIds = snapshot.val();

        if (!visitIds) {
            console.log('No scheduled visits found.');
            return []; 
        }

        const visitIdsArray: string[] = Object.values(visitIds); 
        console.log(`Scheduled visits retrieved: ${visitIdsArray}`);
        return visitIdsArray;
    } catch (error) {
        console.error('Error retrieving scheduled visits:', error);
        return []; 
    }
  }
  
  async addScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.addScheduledVisit - invoked, user id=${userId}, visitId=${visitId}`);
  
    try {
      const userRef = ref(this.db, `/users/${userId}/scheduledVisits`);
      const userSnapshot = await get(userRef);
      
      let userScheduledVisits: string[] = userSnapshot.exists() ? userSnapshot.val() : [];
  
      userScheduledVisits.push(visitId);
  
      await set(userRef, userScheduledVisits);
  
      console.log(`Scheduled visit with ID ${visitId} added to user ${userId}'s scheduledVisits.`);
    } catch (error) {
      console.error('Error: ', error);
      throw error; 
    }
  }

  async removeScheduledVisit(userId: string, visitId: string): Promise<void> {
    console.log(`.removeScheduledVisit - invoked, user id=${userId}, visit id=${visitId}`);

    await this.getScheduledVisits(userId)
      .then((userScheduledVisits) => {
        const visitIndex = userScheduledVisits.findIndex((visit: string) => visit === visitId);

        if (visitIndex !== -1) {
          userScheduledVisits.splice(visitIndex, 1); 
        }

        const updates = {
          [`${this.dbPath}/${userId}/scheduledVisits`]: userScheduledVisits,
        };

        update(ref(this.db), updates);
      });
  }

  async addUser(user: User): Promise<any> {
    const userRef = ref(this.db, `${this.dbPath}/${user.username}`);
    
    const newUserId = push(ref(this.db, this.dbPath)).key; 
    
    const newUser = {
      id: newUserId, 
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      sex: user.sex,
      age: user.age,
      scheduledVisits: user.scheduledVisits,
    };
    return set(userRef, newUser); 
  }

  listenToCartUpdates(userId: string, callback: (visits: ScheduledVisit[]) => void): void {
    console.log(`.listenToCartUpdates - invoked, user id=${userId}`);

    const cartRef = ref(this.db, `${this.dbPath}/${userId}/cart`);
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

  async addToCart(userId: string, visit: ScheduledVisit): Promise<any> {
    console.log(`.addToCart - invoked, user id=${userId}, visit id=${visit.id}`);
  
    const dateWithTimestamp = visit.date.map(i => ({
      day: i.day.getTime(),
      hour: i.hour
    }));
  
    const cartItemRef = push(ref(this.db, `${this.dbPath}/${userId}/cart`));
    visit.id = String(cartItemRef.key); 
  
    const visitWithTimestamp = {
      ...visit,
      date: dateWithTimestamp
    };
  
    return set(cartItemRef, visitWithTimestamp);
  }  

  async removeFromCart(userId: string, visitId: string): Promise<void> {
    console.log(`.removeFromCart - invoked, user id=${userId}, visit id=${visitId}`);

    const cartItemRef = ref(this.db, `${this.dbPath}/${userId}/cart/${visitId}`);
    return set(cartItemRef, null); 
  }
}