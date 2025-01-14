// import { Injectable } from '@angular/core';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, update, get, onValue, DataSnapshot } from 'firebase/database';
// import { environment } from '../../../../../environments/environment';
// import { SingleDayAvailability } from '../../../../model/SingleDayAvailability';
// import { AvailabilityRepositoryInterface } from '../../../interfaces/AvailabilityRepositoryInterface';
// import { TimeSlot } from '../../../../model/TimeSlot';

// @Injectable({
//   providedIn: 'root',
// })
// export class FirebaseAvailabilityRepository implements AvailabilityRepositoryInterface {
//   private db: any;
//   private dbPath = '/availability'; 

//   constructor() {
//     const firebaseApp = initializeApp(environment.firebaseConfig);
//     this.db = getDatabase(firebaseApp); 
//   }

//   async getAvailability(type: string): Promise<SingleDayAvailability[]> {
//     console.log('.getAvailability - invoked');
    
//     const dbRef = ref(this.db, `${this.dbPath}/${type}`);
//     const snapshot: DataSnapshot = await get(dbRef); 
//     return snapshot.val() || []; 
//   }

//   async addAvailability(availabilities: SingleDayAvailability[], type: string): Promise<any> {
//     console.log(`.addAvailability - invoked, type=${type}`);

//     const updatedAvailability = [...availabilities];
//     const updates = {
//       [`${this.dbPath}/${type}`]: updatedAvailability,
//     };

//     return update(ref(this.db), updates);
//   }

//   listenToAvailability(type: string, callback: (visits: SingleDayAvailability[]) => void): void {
//     console.log(`.listenToAvailability - invoked, type=${type}`);
    
//     const fun = async () => {
//       try {
//         const dbRef = ref(this.db, `${this.dbPath}/${type}`);
//         const snapshot: DataSnapshot = await get(dbRef); 
  
//         callback(snapshot.val() || []);
//       } catch (error) {
//         console.error('Error fetching cart updates:', error);
//         callback([]); 
//       }
//     };

//     fun();
//   }
// }
