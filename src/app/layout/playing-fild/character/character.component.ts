import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {constants} from '../../../Models/constants';
import {SettingsService} from '../../../Services/settings.service';
import {debounceTime, fromEvent, interval, merge, Observable, takeUntil} from 'rxjs';
import {Settings} from '../../../Models/settings';
import {BaseComponent} from '../../../Shared-components/base.component';

@Component({
  standalone: false,
  selector: 'app-character',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent extends BaseComponent implements OnInit {

  public posX = window.innerWidth / 2 - constants.CHARACTER_WIDTH / 2;
  private keyActions: Observable<KeyboardEvent> = new Observable<KeyboardEvent>();
  private movementState: 'left' | 'right' | 'stop' = 'stop';
  private playerSpeed = 0;


  constructor(private settingsService: SettingsService,
              private changeDetection: ChangeDetectorRef) {
    super()
  }

  ngOnInit() {
    this.playerSpeed = this.settingsService.playerSpeedUpdated.getValue().playerSpeed;
    this.settingsService.playerSpeedUpdated.pipe(takeUntil(this.destroy)).subscribe( (settings: Settings) => {
      this.playerSpeed = settings.playerSpeed;
    });

    const rightBorder = window.innerWidth - constants.BORDERS - constants.CHARACTER_WIDTH;
    const leftBorder = constants.BORDERS;
    interval(10).pipe(takeUntil(this.destroy)).subscribe(() => {
      if (this.movementState === 'right') {
        this.posX = (this.posX + this.playerSpeed) >= rightBorder ? rightBorder : this.posX + this.playerSpeed;
      } else if (this.movementState === 'left') {
        this.posX = (this.posX - this.playerSpeed) <= leftBorder ? leftBorder : this.posX - this.playerSpeed;
      }
      this.changeDetection.markForCheck();
    });

    this.keyActions = merge(fromEvent(document, 'keydown'), fromEvent(document, 'keyup')) as Observable<KeyboardEvent>;
    this.keyActions.pipe(debounceTime(10), takeUntil(this.destroy)).subscribe((event: KeyboardEvent) => {
      if (event.type === 'keyup') {
        this.movementState = 'stop';
      } else {
        this.movementState = event.key === 'ArrowLeft' ? 'left' : 'right';
      }
    });
  }
}
