import { Injectable } from '@angular/core';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoUserRepository } from '../repositories/mongo/user-repository/user-repository.service';
import { UserRepositoryInterface } from '../interfaces/UserRepositoryInterface';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryFactory {
  constructor(
    private mongoRepo: MongoUserRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): UserRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;
   
      default:
        throw new Error(`Database type not found`);
    }
  }
}
