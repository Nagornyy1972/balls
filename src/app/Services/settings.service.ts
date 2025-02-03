import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '../Models/settings';
import {constants} from '../Models/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  fallingSpeedUpdated: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());
  playerSpeedUpdated: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());
  fallingFrequencyUpdated: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(new Settings());
  leftTime: BehaviorSubject<number> = new BehaviorSubject<number>(constants.INIT_GAME_TIME);
}
