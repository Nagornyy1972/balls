import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Settings} from '../../Models/settings';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  protected settings: Settings = new Settings();

  public settingsForm: FormGroup = new FormGroup({
    fallingSpeed: new FormControl(this.settings.fallingSpeed,[Validators.required, Validators.min(1)]),
    fallingFrequency: new FormControl(this.settings.fallingFrequency,[Validators.required, Validators.min(1)]),
    playerSpeed: new FormControl(this.settings.playerSpeed,[Validators.required, Validators.min(1)]),
    gameTime: new FormControl(this.settings.gameTime,[Validators.required, Validators.min(1)])
  });

  public restartGame(): void {
    console.log(this.settingsForm.invalid)
  }

  test() {
    console.log(this.loginForm)
  }

  loginForm: any = {
    login: '',
    password: '',
  };
}

