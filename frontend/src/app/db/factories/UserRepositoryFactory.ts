import { Injectable } from '@angular/core';
import { FirebaseUserRepository } from '../repositories/firebase/user-repository/user-repository.service';
import { MongoUserRepository } from '../repositories/mongo/user-repository/mongo-user-repository.service';
import { UserRepositoryInterface } from '../interfaces/UserRepositoryInterface';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { JsonUserRepository } from '../repositories/json/user-repository/user-repository.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryFactory {
  constructor(
    private firebaseRepo: FirebaseUserRepository,
    private mongoRepo: MongoUserRepository,
    private jsonRepo: JsonUserRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): UserRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.FIREBASE: 
        return this.firebaseRepo;
      case DatabaseType.MONGODB:
        return this.mongoRepo;
      case DatabaseType.JSON:
        return this.jsonRepo;
      default:
        throw new Error(`Database type not found`);
    }
  }
}
