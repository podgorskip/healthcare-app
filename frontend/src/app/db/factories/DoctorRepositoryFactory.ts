import { Injectable } from '@angular/core';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoDoctorRepository } from '../repositories/mongo/doctor-repository/doctor-repository.service';
import { FirebaseDoctorRepository } from '../repositories/firebase/doctor-repository/doctor-repository.service';
import { DoctorRepositoryInterface } from '../interfaces/DoctorRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class DoctorRepositoryFactory {
  constructor(
    private mongoRepo: MongoDoctorRepository,
    private fireRepo: FirebaseDoctorRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): DoctorRepositoryInterface {
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
