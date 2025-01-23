import { Injectable } from "@angular/core";
import { MongoAuthenticationService } from "../implementation/mongo/MongoAuthenticationService";
import { FirebaseAuthenticationService } from "../implementation/firebase/FirebaseAuthenticationService";
import { DatabaseConfigService } from "../../../db/DatabaseConfigService";
import { AuthenticationServiceInterface } from "../interfaces/AuthenticationServiceInterface";
import { DatabaseType } from "../../../db/DatabaseType";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationServiceFactory {
  constructor(
    private mongoAuthService: MongoAuthenticationService,
    private fireAuthService: FirebaseAuthenticationService,
    private databaseConfig: DatabaseConfigService
  ) {}

  getService(): AuthenticationServiceInterface {
    switch(this.databaseConfig.getDatabase()) {
      case DatabaseType.MONGODB: 
        return this.mongoAuthService;
      case DatabaseType.FIREBASE:
        return this.fireAuthService
      default:
        throw new Error(`Database type not found`);
    }
  }
}
  

