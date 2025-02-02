import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {constants} from '../../Models/constants';
import {Ball} from '../../Models/ball';
import {debounceTime, interval, Subscription} from 'rxjs';
import {SettingsService} from '../../Services/settings.service';

@Component({
  standalone: false,
  selector: 'app-playing-field',
  templateUrl: './playing-field.component.html',
  styleUrl: './playing-field.component.scss'
})
export class PlayingFieldComponent implements OnInit, OnDestroy {

  // @Input() fallingFrequency = 0;
  @Input() playerSpeed = 0;
  @Output() scorePointsEmitter: EventEmitter<number> = new EventEmitter<number>();

  public characterPosition = 0;
  public scorePoints = 0;
  private character: HTMLElement | null = null as HTMLElement | null;

  public balls: Ball[] = [];

  constructor(private settingsService: SettingsService) {
  }

  private keyListener = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' && this.character) {
      this.characterPosition = this.characterPosition + this.playerSpeed < window.innerWidth - constants.BORDERS - constants.CHARACTER_WIDTH
        ? this.characterPosition + this.playerSpeed : window.innerWidth - constants.BORDERS - constants.CHARACTER_WIDTH;
    }
    if (event.key === 'ArrowLeft' && this.character) {
      this.characterPosition = this.characterPosition - this.playerSpeed > constants.BORDERS
        ? this.characterPosition - this.playerSpeed : constants.BORDERS;
    }
  };

  private createBallSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.character = document.getElementById('character');
    this.characterPosition = document.getElementById('character')?.getBoundingClientRect().left || 0;
    window.addEventListener(`keydown`, this.keyListener);

    this.createBallSubscription = this.getBallSubscription(constants.INIT_FALLING_FREQUENCY);

    this.settingsService.fallingFrequencyUpdated.pipe(debounceTime(100)).subscribe(settings => {
      this.createBallSubscription.unsubscribe();
      this.createBallSubscription = this.getBallSubscription(settings.fallingFrequency);
    });
  }

  private getBallSubscription(fallingFrequency: number) {
    return interval(fallingFrequency).subscribe(() => {
      const xPos = constants.BORDERS + Math.random() * (window.innerWidth - constants.BORDERS * 2);
      this.balls.push(new Ball(xPos, constants.TOP_BORDER));
    });
  }

  ngOnDestroy() {
    window.removeEventListener(`keydown`, this.keyListener);
    this.createBallSubscription.unsubscribe();
  }

  destroyBall() {
    if (this.balls[0].x < this.characterPosition + constants.CHARACTER_WIDTH && this.balls[0].x > this.characterPosition) {
      this.scorePointsEmitter.emit(++this.scorePoints);
    }
    this.balls.splice(0, 1);
  }
}
