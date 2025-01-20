import { Injectable } from '@angular/core';
import { VisitRepositoryInterface } from '../../db/interfaces/VisitRepositoryInterface';
import { MongoVisitRepository } from '../repositories/mongo/visit-repository/visit-repository.service';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { FirebaseVisitRepository } from '../repositories/firebase/visit-repository/visit-repository.service';

@Injectable({
  providedIn: 'root'
})
export class VisitRepositoryFactory {
  constructor(
    private mongoRepo: MongoVisitRepository,
    private fireRepo: FirebaseVisitRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): VisitRepositoryInterface {
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
