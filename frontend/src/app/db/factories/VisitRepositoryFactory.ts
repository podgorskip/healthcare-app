import { Injectable } from '@angular/core';
import { VisitRepositoryInterface } from '../../db/interfaces/VisitRepositoryInterface';
import { MongoVisitRepository } from '../repositories/mongo/visit-repository/visit-repository.service';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';

@Injectable({
  providedIn: 'root'
})
export class VisitRepositoryFactory {
  constructor(
    private mongoRepo: MongoVisitRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): VisitRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;

      default:
        throw new Error(`Database type not found`);
    }
  }
}
