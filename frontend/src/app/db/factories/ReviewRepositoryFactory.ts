import { Injectable } from '@angular/core';
import { DatabaseConfigService } from '../DatabaseConfigService';
import { DatabaseType } from '../DatabaseType';
import { MongoReviewRepository } from '../repositories/mongo/review-repository/review-repository.service';
import { ReviewRepositoryInterface } from '../interfaces/ReviewRepositoryInterface';
import { FirebaseReviewRepository } from '../repositories/firebase/review-repository/review-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewRepositoryFactory {
  constructor(
    private mongoRepo: MongoReviewRepository,
    private fireRepo: FirebaseReviewRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): ReviewRepositoryInterface {
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
