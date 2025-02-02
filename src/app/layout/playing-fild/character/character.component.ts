import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-character',
  templateUrl: './character.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  public innerX = 0;

  @Input()
  set posX(value: number) {
    this.innerX = value;
  }

  get posX() {
    return this.innerX;
  }
}
