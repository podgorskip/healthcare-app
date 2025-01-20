import { Auth, getAuth } from 'firebase/auth';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root', 
})
export class FirebaseInitializationService {
    private firebaseApp: FirebaseApp | null = null;

    constructor() {
        this.initializeFirebaseApp();
    }

    private initializeFirebaseApp(): void {
        if (!this.firebaseApp) {
            this.firebaseApp = initializeApp(environment.firebaseConfig);
            console.log('Firebase initialized successfully');
        } else {
            console.log('Firebase already initialized');
        }
    }

    get getFirebaseApp(): FirebaseApp {
        if (!this.firebaseApp) throw new Error('Could not have initialize database.');
        return this.firebaseApp;
    }

    getAuth(): Auth {
        if (!this.firebaseApp) throw new Error('Could not have retrieve auth object.');
        return getAuth(this.firebaseApp);
    }
}
