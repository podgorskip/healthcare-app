import { Injectable } from '@angular/core';
import { getDatabase, ref, get, update, push } from 'firebase/database';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';
import { Observable } from 'rxjs';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserRepository implements UserRepositoryInterface {
  private db: any;
  private dbPath = '/users';  

  constructor(firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
  }

  getUsers(): Observable<User[]> {
    const userRef = ref(this.db, this.dbPath);
    return new Observable((observer) => {
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const users: User[] = [];
            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              const user: User = {
                id: childSnapshot.key!,
                role: userData.role,
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                sex: userData.sex || undefined,
                age: userData.age || undefined,
                password: userData.password || undefined,
                banned: userData.banned || false,
              };
              users.push(user);
            });
            observer.next(users); 
            observer.complete();
          } else {
            observer.error('No users found');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching users: ${error}`);
        });
    });
  }

  // Toggle user ban status (store just the reference)
  toggleUserBan(id: string): Observable<any> {
    const userRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      // Fetch the current user data using the ID
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const updatedUser = { ...userData, banned: !userData.banned };  // Toggle the banned status

            // Update only the necessary fields (just update the 'banned' status)
            update(userRef, updatedUser)
              .then(() => {
                observer.next({ message: `User ${id} ban status toggled successfully.` });
                observer.complete();
              })
              .catch((error) => {
                observer.error(`Error updating user ban status: ${error}`);
              });
          } else {
            observer.error(`User with ID ${id} not found`);
          }
        })
        .catch((error) => {
          observer.error(`Error fetching user data: ${error}`);
        });
    });
  }

  getUserById(id: string): Observable<User> {
    const userRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val();
            observer.next(user);  // Return the full user data
            observer.complete();
          } else {
            observer.error('User not found');
          }
        })
        .catch((error) => {
          observer.error(`Error fetching user: ${error}`);
        });
      });
    }

    addUser(user: User): Promise<any> {
        const userRef = ref(this.db, this.dbPath);
        const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          role: user.role,
          sex: user.sex,
          age: user.age,
        };
    
        return new Promise((resolve, reject) => {
          push(userRef, userData)
            .then((ref) => resolve(ref))
            .catch((error) => reject(error));
        });
    }
}
