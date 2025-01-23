import { FirebaseUserRepository } from './../user-repository/user-repository.service';
import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, push } from 'firebase/database';
import { Observable } from 'rxjs';
import { PatientRepositoryInterface } from '../../../interfaces/PatientRepositoryInterface';
import { Patient } from '../../../../model/Patient';
import { FirebaseCartRepository } from '../cart-repository/cart-repository.service';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root'
})
export class FirebasePatientRepository implements PatientRepositoryInterface {
  private db: any;
  private dbPath = '/patients';  

  constructor(
    private userRepository: FirebaseUserRepository,
    private cartRepository: FirebaseCartRepository,
    firebaseInit: FirebaseInitializationService
  ) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  addPatient(patient: Patient): Observable<any> {
  return new Observable((observer) => {
    this.userRepository.getUsers().subscribe({
        next: (users) => {
            const existingUser = users.find((u) => u.username === patient.user.username);

            if (existingUser) {
              throw new Error('User with the same email already exists.');
            } else {
              this.userRepository.addUser(patient.user).then((userRef) => {
                const userId = userRef.key;
    
                if (userId) {
                  if (patient.user.password) {
                    this.userRepository.registerUser(patient.user.username, patient.user.password, userRef);
                  }
    
                  this.ensurePatientAndCart(patient, userId, observer);
                } else {
                  observer.error('Failed to create user.');
                }
              }).catch((error) => {
                observer.error(`Error saving user: ${error}`);
              });
            }
        }
    })
  });
}

private ensurePatientAndCart(patient: Patient, userId: string, observer: any) {
  this.cartRepository.addCart(patient.cart).then((cartRef) => {
    const cartId = cartRef.key;

    const patientRef = ref(this.db, this.dbPath);
          const patientData = {
            id: patientRef.key,
            userId: userId,
            cartId: cartId,
          };

          console.log(patientData)

    push(patientRef, patientData)
        .then(() => {
            observer.next({ message: 'Patient added successfully.' });
            observer.complete();
        })
        .catch((error) => {
            observer.error(`Error saving patient data: ${error}`);
    });

  }).catch((error) => {
    observer.error(`Error saving cart: ${error}`);
  });
}

  getPatientById(id: string): Observable<Patient> {
    const patientRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      get(patientRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const patientData = snapshot.val();
            this.userRepository.getUserById(patientData.userId).subscribe(
              (user) => {
                this.cartRepository.getCartById(patientData.cartId).subscribe(
                  (cart) => {
                    const patient: Patient = {
                      id: patientData.id,
                      user: user,  
                      cart: cart,  
                    };
                    observer.next(patient);
                    observer.complete();
                  },
                  (error) => {
                    observer.error(`Error fetching cart data: ${error}`);
                  }
                );
              },
              (error) => {
                observer.error(`Error fetching user data: ${error}`);
              }
            );
          } else {
            observer.error('Patient not found');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching patient: ${error}`);
        });
    });
  }
}
