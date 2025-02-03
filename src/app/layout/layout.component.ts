import {Component, ViewChild} from '@angular/core';
import {Settings} from '../Models/settings';
import {map, Subscription, takeUntil, timer} from 'rxjs';
import {SettingsComponent} from './settings/settings.component';
import {SettingsService} from '../Services/settings.service';
import {BaseComponent} from '../Shared-components/base.component';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends BaseComponent {
  public gameStarted = false;
  public gameSettings: Settings = new Settings();

  @ViewChild('settingsComponent') settingsComponent?: SettingsComponent;

  private gameOverSubscription: Subscription = new Subscription();

  constructor(private settingsService: SettingsService) {
    super();
  }

  public restartGame(settings: Settings) {
    this.gameOverSubscription.unsubscribe();
    this.gameSettings = settings;
    this.settingsService.leftTime.next(this.gameSettings.gameTime);
    this.gameStarted = false;
    setTimeout(() => {
      this.gameStarted = true;
      this.gameOverSubscription = timer(1000, 1000).pipe(map(sc => this.gameSettings.gameTime - sc), takeUntil(this.destroy)).subscribe( (sc) => {
        this.settingsService.leftTime.next(sc);
        if (sc <= 0) {
          this.gameOverSubscription.unsubscribe();
          this.gameStarted = false;
        }
      });
    }, 10)
  }
}
