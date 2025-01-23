import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseComponent } from '../database/database.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, DatabaseComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  
}
