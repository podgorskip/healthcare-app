import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messagesSubject = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:3000'); 

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messagesSubject.next(message);
    };
  }

  listen(eventType: string): Observable<any> {
    return new Observable((observer) => {
      this.messagesSubject.subscribe((message) => {
        if (message.type === eventType) {
          observer.next(message.data);
        }
      });
    });
  }

  send(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
