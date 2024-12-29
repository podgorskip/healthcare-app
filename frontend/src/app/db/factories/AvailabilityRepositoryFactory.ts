import { Injectable } from '@angular/core';
import { AvailabilityRepositoryInterface } from '../interfaces/AvailabilityRepositoryInterface';
import { FirebaseAvailabilityRepository } from '../repositories/firebase/availability-repository/AvailabilityRepository';
import { MongoAvailabilityRepository } from '../repositories/mongo/availability-repository/availability-repository.service';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityRepositoryFactory {
  constructor(
    private firebaseRepo: FirebaseAvailabilityRepository,
    private mongoRepo: MongoAvailabilityRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): AvailabilityRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.FIREBASE: 
        return this.firebaseRepo;
      case DatabaseType.MONGODB:
        return this.mongoRepo;
      default:
        throw Error(`Database type not found`)
    }
  }
}
