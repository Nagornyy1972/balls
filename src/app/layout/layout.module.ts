import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {routing} from './layout-routing.module';
import {PlayingFieldComponent} from './playing-fild/playing-field.component';
import {SettingsComponent} from './settings/settings.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@NgModule({
  declarations: [
    LayoutComponent,
    PlayingFieldComponent,
    SettingsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    routing,
    NgIf
  ],
  providers: [],
})
export class LayoutModule { }
