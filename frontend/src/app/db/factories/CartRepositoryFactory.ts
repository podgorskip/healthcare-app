import { Injectable } from "@angular/core";
import { MongoCartRepository } from "../repositories/mongo/cart-repository/cart-repository.service";
import { DatabaseConfigService } from "../DatabaseConfigService";
import { DatabaseType } from "../DatabaseType";
import { CartRepositoryInterface } from "../interfaces/CartRepositoryInterface";

@Injectable({
  providedIn: 'root'
})
export class CartRepositoryFactory {
  constructor(
    private mongoRepo: MongoCartRepository,
    private databaseConfig: DatabaseConfigService
  ) {}

  getRepository(): CartRepositoryInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB:
        return this.mongoRepo;
   
      default:
        throw new Error(`Database type not found`);
    }
  }
}