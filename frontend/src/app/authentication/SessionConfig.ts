import { Injectable } from '@angular/core';
import { SessionType } from './enum/SessionType';

@Injectable({
  providedIn: 'root'
})
export class SessionConfigService {
  private session: SessionType = SessionType.LOCAL;  

  constructor() {}

  getSession(): SessionType {
    return this.session;
  }

  setSession(session: SessionType): void {
    this.session = session;
  }
}
