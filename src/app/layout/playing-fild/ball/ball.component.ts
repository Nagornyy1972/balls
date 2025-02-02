import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Ball} from '../../../Models/ball';
import {debounceTime, interval, Subscription} from 'rxjs';
import {constants} from '../../../Models/constants';
import {SettingsService} from '../../../Services/settings.service';
import {Settings} from '../../../Models/settings';

@Component({
  standalone: false,
  selector: 'app-ball',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ball.component.html',
  styleUrl: './ball.component.scss'
})
export class BallComponent implements OnInit, OnDestroy {

  @Output() destroyBall: EventEmitter<boolean> = new EventEmitter<boolean>();

  settingsUpdatedSubscription: Subscription = new Subscription();

  private innerBall: Ball = new Ball();
  private falling: Subscription = new Subscription();

  @Input()
  set ball(value: Ball) {
    this.innerBall = value;
  }
  get ball() {
    return this.innerBall
  }

  constructor(private settingsService: SettingsService,
              private changeDetection: ChangeDetectorRef) {
  }


  ngOnInit() {
    //this.falling = this.getFalling(this.settingsService.fallingSpeedUpdated.getValue().fallingSpeed);
    this.settingsService.fallingSpeedUpdated.pipe(debounceTime(100)).subscribe( (settings: Settings) => {
      this.falling.unsubscribe();
      this.falling = this.getFalling(settings.fallingSpeed);
    });
  }

  ngOnDestroy() {
    this.settingsUpdatedSubscription.unsubscribe();
    this.falling.unsubscribe();
  }

  private getFalling(fallingSpeed: number) {
    return interval(fallingSpeed).subscribe(() => {
      if (this.innerBall.y > window.innerHeight - constants.BOTTOM_BORDER) {
        this.destroyBall.emit(true);
      } else {
        this.innerBall.y++;
        this.changeDetection.markForCheck();
      }
    });
  }
}
