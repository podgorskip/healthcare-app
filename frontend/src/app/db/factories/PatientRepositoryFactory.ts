import { Injectable } from '@angular/core';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoPatientRepository } from '../repositories/mongo/patient-repository/patient-repository.service';
import { PatientRepositoryInterface } from '../interfaces/PatientRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class PatientRepositoryFactory {
  constructor(
    private mongoRepo: MongoPatientRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): PatientRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;
      default:
        throw new Error(`Database type not found`);
    }
  }
}
