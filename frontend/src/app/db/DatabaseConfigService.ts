import { Injectable } from '@angular/core';
import { DatabaseType } from './DatabaseType';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConfigService {
  private database: DatabaseType = DatabaseType.MONGODB;  

  constructor() {}

  getDatabase(): DatabaseType {
    return this.database;
  }

  setDatabase(database: DatabaseType): void {
    this.database = database;
  }
}
