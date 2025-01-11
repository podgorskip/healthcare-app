import { Component } from '@angular/core';
import { SessionConfigService } from '../../../authentication/SessionConfig';
import { SessionType } from '../../../authentication/enum/SessionType';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  sessionTypes: SessionType[] = [];
  currentSession!: SessionType;

  constructor(private sessionConfig: SessionConfigService) {
    this.sessionTypes = Object.values(SessionType);
    this.currentSession = sessionConfig.getSession();
  }

  onSessionChange(): void {
    this.sessionConfig.setSession(this.currentSession); 
  }
}
