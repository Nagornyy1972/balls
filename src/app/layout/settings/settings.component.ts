import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Settings} from '../../Models/settings';
import {SettingsService} from '../../Services/settings.service';
import {constants} from '../../Models/constants';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  @Input() gameStarted = false;
  @Output() private restartGameEmitter: EventEmitter<Settings> = new EventEmitter<Settings>();
  public scorePoints = 0;
  private formBuilder: FormBuilder = new FormBuilder();

  settingsForm = this.formBuilder.group({
    fallingSpeed: [constants.INIT_FALLING_SPEED, [Validators.required, Validators.min(1)]],
    fallingFrequency: [constants.INIT_FALLING_FREQUENCY, [Validators.required, Validators.min(1)]],
    playerSpeed: [constants.INIT_PLAYER_SPEED, [Validators.required, Validators.min(1)]],
    gameTime: [constants.INIT_GAME_TIME, [Validators.required, Validators.min(1)]]
  });

  constructor(private settingsService: SettingsService) {
  }

  public getLeftTime() {
    return this.settingsService.leftTime;
  }

  public setLeftTime() {
    return this.settingsService.leftTime.next(this.settingsForm.controls.gameTime.value as number);
  }

  public restartGame(): void {
    this.scorePoints = 0;
    this.restartGameEmitter.emit(this.settingsForm.value as Settings);
  }

  public updateSettings(settingsProperty: string): void {
    switch (settingsProperty) {
      case 'playerSpeed':
        this.settingsForm.controls.playerSpeed.patchValue(Math.max(1, this.settingsForm.controls.playerSpeed.value as number));
        break;
      case 'fallingSpeed':
        this.settingsForm.controls.fallingSpeed.patchValue(Math.max(1, this.settingsForm.controls.fallingSpeed.value as number));
        this.settingsService.fallingSpeedUpdated.next(this.settingsForm.value as Settings);
        break;
      case 'fallingFrequency':
        this.settingsForm.controls.fallingFrequency.patchValue(Math.max(1, this.settingsForm.controls.fallingFrequency.value as number));
        this.settingsService.fallingFrequencyUpdated.next(this.settingsForm.value as Settings);
    }
  }
}

