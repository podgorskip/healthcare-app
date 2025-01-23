import { Injectable } from '@angular/core';
import { getDatabase, ref, get, update, push } from 'firebase/database';
import { UserRepositoryInterface } from '../../../interfaces/UserRepositoryInterface';
import { User } from '../../../../model/User';
import { Observable } from 'rxjs';
import { FirebaseInitializationService } from '../../../setup/FirebaseInitializationService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Role } from '../../../../model/enum/Role';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserRepository implements UserRepositoryInterface {
  private db: any;
  private dbPath = '/users';  

  constructor(private firebaseInit: FirebaseInitializationService) {
    this.db = getDatabase(firebaseInit.getFirebaseApp);
    this.init();
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
                username: userData.email,
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

  toggleUserBan(id: string): Observable<any> {
    const userRef = ref(this.db, `${this.dbPath}/${id}`);
    return new Observable((observer) => {
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const updatedUser = { ...userData, banned: !userData.banned };  

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
            observer.next(user); 
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
            firstName: user.firstName || '',  
            lastName: user.lastName || '',    
            email: user.username,
            role: user.role,
            sex: user.sex || '',            
            age: user.age || null,          
        };

        return new Promise((resolve, reject) => {
          push(userRef, userData)
            .then((ref) => resolve(ref))
            .catch((error) => reject(error));
        });
    }

    registerUser(email: string, password: string, user: User): Promise<any> {
        const auth = this.firebaseInit.getAuth();
    
        return new Promise((resolve, reject) => {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const firebaseUser = userCredential.user;
    
              this.addUser({
                ...user,
                id: firebaseUser.uid,
                username: email,
              })
                .then((ref) => resolve(ref))
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        });
    }

    private async init(): Promise<void> {
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'password';
        const adminRef = ref(this.db, this.dbPath);
    
        try {
          const snapshot = await get(adminRef);
          let adminExists = false;
    
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              if (userData.role === 'admin' && userData.email === adminEmail) {
                adminExists = true;
              }
            });
          }
    
          if (!adminExists) {
            const auth = this.firebaseInit.getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
            const firebaseUser = userCredential.user;
    
            const newAdmin: User = {
              id: firebaseUser.uid,
              role: Role.ADMIN,
              firstName: 'Admin',
              lastName: 'Admin',
              username: adminEmail,
              password: adminPassword, 
              banned: false
            };
    
            await this.addUser(newAdmin);
            console.log('Admin user added to the database.');
          } else {
            console.log('Admin user already exists.');
          }
        } catch (error) {
          console.error('Error during initialization:', error);
        }
    }
}
