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
import {debounceTime, interval, Subscription, takeUntil} from 'rxjs';
import {constants} from '../../../Models/constants';
import {SettingsService} from '../../../Services/settings.service';
import {Settings} from '../../../Models/settings';
import {BaseComponent} from '../../../Shared-components/base.component';

@Component({
  standalone: false,
  selector: 'app-ball',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ball.component.html',
  styleUrl: './ball.component.scss'
})
export class BallComponent extends BaseComponent implements OnInit {

  @Output() destroyBall: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    super();
  }


  ngOnInit() {
    //this.falling = this.getFalling(this.settingsService.fallingSpeedUpdated.getValue().fallingSpeed);
    this.settingsService.fallingSpeedUpdated.pipe(debounceTime(100), takeUntil(this.destroy)).subscribe( (settings: Settings) => {
      this.falling.unsubscribe();
      this.falling = this.getFalling(settings.fallingSpeed);
    });
  }

  private getFalling(fallingSpeed: number) {
    return interval(fallingSpeed).pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.innerBall.y > window.innerHeight - constants.BOTTOM_BORDER) {
        this.destroyBall.emit(true);
      } else {
        this.innerBall.y++;
        this.changeDetection.markForCheck();
      }
    });
  }
}
