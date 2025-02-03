import {Subject} from 'rxjs';
import {Component, OnDestroy} from '@angular/core';

@Component({
  standalone: false,
  template: '',
})

export abstract class BaseComponent implements OnDestroy {
  protected destroy: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.destroy.next();
  }
}
