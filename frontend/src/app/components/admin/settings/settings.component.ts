import { Component } from '@angular/core';
import { DatabaseType } from '../../../db/DatabaseType';
import { DatabaseConfigService } from '../../../db/DatabaseConfigService';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
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
