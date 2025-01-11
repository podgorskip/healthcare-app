import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseType } from '../../../db/DatabaseType';
import { DatabaseConfigService } from '../../../db/DatabaseConfigService';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './database.component.html',
  styleUrl: './database.component.css'
})
export class DatabaseComponent {
  databases: DatabaseType[] = [];
  current: DatabaseType;

  constructor(private databaseConfig: DatabaseConfigService) {
    this.databases = Object.values(DatabaseType);
    this.current = databaseConfig.getDatabase();
  }

  onDatabaseChange(): void {
    this.databaseConfig.setDatabase(this.current); 
  }
}