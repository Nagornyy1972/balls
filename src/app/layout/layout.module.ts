import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {routing} from './layout-routing.module';
import {PlayingFieldComponent} from './playing-fild/playing-field.component';
import {SettingsComponent} from './settings/settings.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {CharacterComponent} from './playing-fild/character/character.component';
import {BallComponent} from './playing-fild/ball/ball.component';
import {SettingsService} from '../Services/settings.service';

@NgModule({
  declarations: [
    LayoutComponent,
    PlayingFieldComponent,
    SettingsComponent,
    CharacterComponent,
    BallComponent
  ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        routing,
        NgIf,
        NgForOf,
        NgStyle,
        AsyncPipe
    ],
  providers: [
    SettingsService
  ],
})
export class LayoutModule { }
