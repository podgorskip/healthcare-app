import { Injectable } from '@angular/core';
import { getDatabase, ref, set, push, onValue, get, remove, update } from 'firebase/database';
import { VisitRepositoryInterface } from '../../../interfaces/VisitRepositoryInterface';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { Observable, from, of } from 'rxjs';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root',
})
export class FirebaseVisitRepository implements VisitRepositoryInterface {
  private db: any;
  private dbPath = '/visits';

  constructor(firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  addVisit(visit: ScheduledVisit): Observable<ScheduledVisit> {
    return new Observable((observer) => {
      try {
        const visitRef = push(ref(this.db, this.dbPath));
        const visitId = visitRef.key;
        if (!visitId) {
          observer.error('Could not generate visit ID');
          return;
        }

        set(visitRef, { ...visit, id: visitId })
          .then(() => {
            observer.next({ ...visit, id: visitId });
            observer.complete();
          })
          .catch((error) => {
            observer.error(`Error adding visit: ${error}`);
          });
      } catch (error) {
        observer.error(`Error adding visit: ${error}`);
      }
    });
  }

  async getAllVisits(): Promise<ScheduledVisit[]> {
    try {
      const visitsSnapshot = await get(ref(this.db, this.dbPath));
      if (visitsSnapshot.exists()) {
        const visitsData = visitsSnapshot.val();
        return Object.keys(visitsData).map((key) => ({
          ...visitsData[key],
          id: key,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error retrieving visits:', error);
      throw new Error('Could not fetch visits');
    }
  }

  async getVisitById(id: string): Promise<ScheduledVisit | null> {
    try {
      const visitSnapshot = await get(ref(this.db, `${this.dbPath}/${id}`));
      if (visitSnapshot.exists()) {
        return { ...visitSnapshot.val(), id };
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving visit with ID ${id}:`, error);
      throw new Error('Could not fetch visit');
    }
  }

  async updateVisit(id: string, visit: Partial<ScheduledVisit>): Promise<void> {
    try {
      const visitRef = ref(this.db, `${this.dbPath}/${id}`);
      await update(visitRef, visit);
    } catch (error) {
      console.error(`Error updating visit with ID ${id}:`, error);
      throw new Error('Could not update visit');
    }
  }

  deleteVisit(id: string): Observable<string> {
    return new Observable((observer) => {
      try {
        const visitRef = ref(this.db, `${this.dbPath}/${id}`);
        remove(visitRef)
          .then(() => {
            observer.next(`Visit with ID ${id} deleted successfully.`);
            observer.complete();
          })
          .catch((error) => {
            observer.error(`Error deleting visit with ID ${id}: ${error}`);
          });
      } catch (error) {
        observer.error(`Error deleting visit with ID ${id}: ${error}`);
      }
    });
  }

  getPatientVisits(patientId: string): Observable<ScheduledVisit[]> {
    return new Observable((observer) => {
      const visitsRef = ref(this.db, this.dbPath);
      onValue(visitsRef, (snapshot) => {
        const visitsData = snapshot.val();
        const patientVisits = visitsData
          ? Object.keys(visitsData)
              .filter((key) => visitsData[key].patientId === patientId)
              .map((key) => ({ ...visitsData[key], id: key }))
          : [];
        observer.next(patientVisits);
        observer.complete();
      });
    });
  }

  getDoctorVisits(doctorId: string): Observable<ScheduledVisit[]> {
    return new Observable((observer) => {
      const visitsRef = ref(this.db, this.dbPath);
      onValue(visitsRef, (snapshot) => {
        const visitsData = snapshot.val();
        const doctorVisits = visitsData
          ? Object.keys(visitsData)
              .filter((key) => visitsData[key].doctorId === doctorId)
              .map((key) => ({ ...visitsData[key], id: key }))
          : [];
        observer.next(doctorVisits);
        observer.complete();
      });
    });
  }

  cancelVisit(id: string): Observable<ScheduledVisit> {
    return new Observable((observer) => {
      const visitRef = ref(this.db, `${this.dbPath}/${id}`);
      
      update(visitRef, { status: 'canceled' })
        .then(() => {
          get(visitRef).then((snapshot) => {
            if (snapshot.exists()) {
              const updatedVisit = snapshot.val();
              observer.next(updatedVisit); 
              observer.complete();
            } else {
              observer.error('Visit not found');
            }
          });
        })
        .catch((error) => {
          observer.error(`Error cancelling visit with ID ${id}: ${error}`);
        });
    });
  }

  addVisitReview(review: { score: number; comment: string }, id: string): Observable<any> {
    return new Observable((observer) => {
      const visitRef = ref(this.db, `${this.dbPath}/${id}`);
      
      update(visitRef, { review })
        .then(() => {
          observer.next({ message: `Review added to visit with ID ${id}.`, review });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error adding review to visit with ID ${id}: ${error}`);
        });
    });
  }

  listenToVisits(callback: (visits: ScheduledVisit[]) => void): void {
    const visitsRef = ref(this.db, this.dbPath);
    onValue(visitsRef, (snapshot) => {
      const visitsData = snapshot.val();
      const visits = visitsData
        ? Object.keys(visitsData).map((key) => ({ ...visitsData[key], id: key }))
        : [];
      callback(visits);
    });
  }

  startListeningVisitCancellation(id: string): Observable<ScheduledVisit> {
    console.log('.startListeningVisitCancellation - invoked');
    
    return new Observable<ScheduledVisit>((observer) => {
      const visitRef = ref(this.db, `${this.dbPath}/${id}`);
      
      onValue(visitRef, (snapshot) => {
        if (snapshot.exists()) {
          const visitData = snapshot.val() as ScheduledVisit;
          console.log('Firebase visit cancellation update: ', visitData);
          observer.next(visitData);
        } else {
          console.error('Visit not found');
          observer.error('Visit not found');
        }
      }, (error) => {
        console.error('Firebase error:', error);
        observer.error(`Firebase error: ${error}`);
      });
    });
  }
}
