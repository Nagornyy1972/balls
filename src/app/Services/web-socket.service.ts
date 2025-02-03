import {Injectable} from '@angular/core';
import {WebSocketEmulatorService} from './web-socket-emulator.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  public socket?: WebSocketEmulatorService | null;

  constructor(private settingsService: SettingsService) {
  }

  public sendToSocket(message: string) {
    if (this.socket) {
      if (this.socket.readyState === 1) {
        this.socket.send(message);
      }
    } else {
      this.initSocket();
    }
  }

  public closeSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public initSocket() {
    this.socket = new WebSocketEmulatorService();

    this.socket.onmessage = (message: string) => {
      const data = JSON.parse(message);
      if (data.timeRemaining) {
        this.settingsService.leftTime.next(data.timeRemaining);
      }
    };

    this.socket.onerror = (error) => {
      console.log(error);
    };
  }
}
