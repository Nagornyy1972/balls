import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Settings} from '../Models/settings';
import {map, Subscription, timer} from 'rxjs';
import {SettingsComponent} from './settings/settings.component';
import {SettingsService} from '../Services/settings.service';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  public gameStarted = false;
  public gameSettings: Settings = new Settings();

  @ViewChild('settingsComponent') settingsComponent?: SettingsComponent;

  private gameOverSubscription: Subscription = new Subscription();

  constructor(private settingsService: SettingsService) {
  }

  public restartGame(settings: Settings) {
    this.gameOverSubscription.unsubscribe();
    this.gameSettings = settings;
    this.settingsService.leftTime.next(this.gameSettings.gameTime);
    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
      this.gameOverSubscription = timer(1000, 1000).pipe(map(sc => this.gameSettings.gameTime - sc)).subscribe( (sc) => {
        this.settingsService.leftTime.next(sc);
        if (sc <= 0) {
          this.gameOverSubscription.unsubscribe();
          this.gameStarted = false;
        }
      });
    }, 10)
  }

  public getPlayerSpeed() {
    return this.settingsComponent?.settingsForm.controls['playerSpeed'].value as number;
  }

  ngOnDestroy() {
    this.gameOverSubscription.unsubscribe();
  }
}
