import { Injectable } from '@angular/core';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoPatientRepository } from '../repositories/mongo/patient-repository/patient-repository.service';
import { PatientRepositoryInterface } from '../interfaces/PatientRepositoryInterface';
import { FirebasePatientRepository } from '../repositories/firebase/patient-repository/patient-repository.service';

@Injectable({
  providedIn: 'root'
})
export class PatientRepositoryFactory {
  constructor(
    private mongoRepo: MongoPatientRepository,
    private fireRepo: FirebasePatientRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): PatientRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;
      case DatabaseType.FIREBASE:
        return this.fireRepo;
      default:
        throw new Error(`Database type not found`);
    }
  }
}
