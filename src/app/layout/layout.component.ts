import {Component, OnInit, ViewChild} from '@angular/core';
import {Settings} from '../Models/settings';
import {takeUntil} from 'rxjs';
import {SettingsComponent} from './settings/settings.component';
import {SettingsService} from '../Services/settings.service';
import {BaseComponent} from '../Shared-components/base.component';
import {WebSocketService} from '../Services/web-socket.service';
import {GameTime} from '../Models/socket';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends BaseComponent implements OnInit {
  public gameStarted = false;
  public gameSettings: Settings = new Settings();

  @ViewChild('settingsComponent') settingsComponent?: SettingsComponent;

  constructor(private settingsService: SettingsService, private webSocketService: WebSocketService) {
    super();
  }

  ngOnInit() {
    this.settingsService.leftTime.pipe(takeUntil(this.destroy)).subscribe((leftTime: number) => {
      if (leftTime <= 0) {
          this.webSocketService.closeSocket();
          this.gameStarted = false;
      }
    });
  }

  public restartGame(settings: Settings) {
    this.gameSettings = settings;
    this.settingsService.leftTime.next(this.gameSettings.gameTime);
    this.webSocketService.closeSocket();
    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
      this.webSocketService.initSocket();
      this.webSocketService.sendToSocket(JSON.stringify(new GameTime(settings.gameTime)))
    }, 100);
  }
}
