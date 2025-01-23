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
  current!: DatabaseType;

  constructor(private databaseConfig: DatabaseConfigService) {
    this.databases = Object.values(DatabaseType);
    const persisted = localStorage.getItem('db-type');

    if (persisted && Object.values(DatabaseType).includes(persisted as DatabaseType)) {
      this.current = persisted as DatabaseType;
    } else {
      this.current = databaseConfig.getDatabase();
    }

    console.log('Current: ', this.current)
  }

  onDatabaseChange(): void {
    localStorage.setItem('db-type', this.current);
    this.databaseConfig.setDatabase(this.current); 
    console.log(this.current);
  }
}