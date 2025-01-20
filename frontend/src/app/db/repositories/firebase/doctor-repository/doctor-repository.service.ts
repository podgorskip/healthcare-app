import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, remove, update, child } from 'firebase/database';
import { Observable, from } from 'rxjs';
import { DoctorRepositoryInterface } from '../../../interfaces/DoctorRepositoryInterface';
import { Doctor } from '../../../../model/Doctor';
import { SingleDayAvailability } from '../../../../model/SingleDayAvailability';
import { ScheduledVisit } from '../../../../model/ScheduledVisit';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDoctorRepository implements DoctorRepositoryInterface {
  private db: any;
  private dbPath = '/doctors';

  constructor(firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  // Add a new doctor
  addDoctor(doctor: Doctor): Observable<any> {
    const doctorRef = ref(this.db, `${this.dbPath}/${doctor.id}`);
    return new Observable((observer) => {
      set(doctorRef, doctor)
        .then(() => {
          observer.next({ message: 'Doctor added successfully.' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error adding doctor: ${error}`);
        });
    });
  }

  // Get all doctors
  getDoctors(): Observable<Doctor[]> {
    const doctorsRef = ref(this.db, this.dbPath);
    return new Observable((observer) => {
      get(doctorsRef)
        .then((snapshot) => {
          const doctors: Doctor[] = [];
          snapshot.forEach((childSnapshot) => {
            doctors.push(childSnapshot.val());
          });
          observer.next(doctors); // Return all doctor data
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error fetching doctors: ${error}`);
        });
    });
  }

  // Get a doctor by ID
  getDoctorById(id: string): Observable<Doctor> {
    const doctorRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      get(doctorRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const doctor = snapshot.val();
            observer.next(doctor);  // Return the doctor data
            observer.complete();
          } else {
            observer.error('Doctor not found');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching doctor: ${error}`);
        });
    });
  }

  // Remove a doctor
  removeDoctor(id: string): Observable<any> {
    const doctorRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      remove(doctorRef)
        .then(() => {
          observer.next({ message: 'Doctor removed successfully.' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error removing doctor: ${error}`);
        });
    });
  }

  // Get all visits for a specific doctor
  getDoctorVisits(id: string): Observable<ScheduledVisit[]> {
    const visitsRef = ref(this.db, `${this.dbPath}/${id}/visits`);
    return new Observable((observer) => {
      get(visitsRef)
        .then((snapshot) => {
          const visits: ScheduledVisit[] = [];
          snapshot.forEach((childSnapshot) => {
            visits.push(childSnapshot.val());
          });
          observer.next(visits); // Return visits data
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error fetching doctor visits: ${error}`);
        });
    });
  }

  // Get doctor availability
  getDoctorAvailability(id: string, type: string): Observable<SingleDayAvailability[]> {
    const availabilityRef = ref(this.db, `${this.dbPath}/${id}/availability/${type}`);
    return new Observable((observer) => {
      get(availabilityRef)
        .then((snapshot) => {
          const availability: SingleDayAvailability[] = [];
          snapshot.forEach((childSnapshot) => {
            availability.push(childSnapshot.val());
          });
          observer.next(availability);  // Return availability data
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error fetching doctor availability: ${error}`);
        });
    });
  }

  // Add doctor availability
  addDoctorAvailability(id: string, availabilities: SingleDayAvailability[], type: string): Observable<any> {
    const availabilityRef = ref(this.db, `${this.dbPath}/${id}/availability/${type}`);
    return new Observable((observer) => {
      set(availabilityRef, availabilities)
        .then(() => {
          observer.next({ message: 'Doctor availability added successfully.' });
          observer.complete();
        })
        .catch((error) => {
          observer.error(`Error adding availability: ${error}`);
        });
    });
  }
}
