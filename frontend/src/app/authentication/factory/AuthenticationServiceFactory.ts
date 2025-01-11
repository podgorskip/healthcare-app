import { Injectable } from "@angular/core";
import { AuthenticationServiceInterface } from "../interfaces/AuthenticationServiceInterface";
import { MongoAuthenticationService } from "../mongo/MongoAuthenticationService";
import { DatabaseConfigService } from "../../db/DatabaseConfigService";
import { DatabaseType } from "../../db/DatabaseType";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationServiceFactory {
  constructor(
    private mongoAuthService: MongoAuthenticationService,
    private databaseConfig: DatabaseConfigService
  ) {}

  getService(): AuthenticationServiceInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB: 
        return this.mongoAuthService;
      default:
        throw new Error(`Database type not found`);
    }
  }
}
  

