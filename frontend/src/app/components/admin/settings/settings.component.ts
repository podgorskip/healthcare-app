import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseComponent } from '../database/database.component';
import { SessionComponent } from "../session/session.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, DatabaseComponent, SessionComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  
}
