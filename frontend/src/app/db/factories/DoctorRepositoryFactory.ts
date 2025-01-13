import { Injectable } from '@angular/core';
import { UserRepositoryInterface } from '../interfaces/UserRepositoryInterface';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoDoctorRepository } from '../repositories/mongo/doctor-repository/doctor-repository.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorRepositoryFactory {
  constructor(
    private mongoRepo: MongoDoctorRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): MongoDoctorRepository {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;
   
      default:
        throw new Error(`Database type not found`);
    }
  }
}
