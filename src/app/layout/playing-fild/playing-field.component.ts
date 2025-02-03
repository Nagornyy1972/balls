import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {constants} from '../../Models/constants';
import {Ball} from '../../Models/ball';
import {debounceTime, interval, Subscription, takeUntil} from 'rxjs';
import {SettingsService} from '../../Services/settings.service';
import {BaseComponent} from '../../Shared-components/base.component';
import {CharacterComponent} from './character/character.component';
import {WebSocketService} from '../../Services/web-socket.service';
import {CaughtObjects} from '../../Models/socket';

@Component({
  standalone: false,
  selector: 'app-playing-field',
  templateUrl: './playing-field.component.html',
  styleUrl: './playing-field.component.scss'
})
export class PlayingFieldComponent extends BaseComponent implements OnInit {

  @Output() scorePointsEmitter: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('characterComponent') characterComponent?: CharacterComponent;

  public scorePoints = 0;

  public balls: Ball[] = [];

  constructor(private settingsService: SettingsService, private webSocketService: WebSocketService) {
    super();
  }

  private createBallSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.createBallSubscription = this.getBallSubscription(constants.INIT_FALLING_FREQUENCY);

    this.settingsService.fallingFrequencyUpdated.pipe(debounceTime(100), takeUntil(this.destroy)).subscribe(settings => {
      this.createBallSubscription.unsubscribe();
      this.createBallSubscription = this.getBallSubscription(settings.fallingFrequency);
    });
  }

  private getBallSubscription(fallingFrequency: number) {
    return interval(fallingFrequency).pipe(takeUntil(this.destroy)).subscribe(() => {
      const xPos = constants.BORDERS + Math.random() * (window.innerWidth - constants.BORDERS * 2);
      this.balls.push(new Ball(xPos, constants.TOP_BORDER));
    });
  }

  destroyBall() {
    if (this.characterComponent && this.balls[0].x < this.characterComponent?.posX + constants.CHARACTER_WIDTH && this.balls[0].x > this.characterComponent?.posX) {
      this.scorePointsEmitter.emit(++this.scorePoints);
      this.webSocketService.sendToSocket(JSON.stringify(new CaughtObjects(this.scorePoints)));
    }
    this.balls.splice(0, 1);
  }
}
