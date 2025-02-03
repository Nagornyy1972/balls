import {map, Subject, Subscription, timer} from 'rxjs';
import {SocketResponse} from '../Models/socket';

export class WebSocketEmulatorService {

  constructor() {
    this.readyState = 1;
    this.pushMessagesEmulator();
    this.pushMessage.subscribe((message) => {
      if (this.onmessage) {
        this.onmessage(message);
      }
    });
    this.throwError.subscribe((error) => {
      if (this.onerror) {
        this.onerror(error);
      }
    });
  }

  onerror?: (error: string) => void;
  onmessage?: (data: string) => void;

  public readyState = 0;

  close(): void {
    this.readyState = 0;
    this.gameOverSubscription.unsubscribe();
  };

  send(data: string): void {
    const message = JSON.parse(data);
    if (message.count) {
      this.caughtObjects = message.count;
      this.pushMessage.next(JSON.stringify({status: 'Ok'}));
    } else if (message.gameTime) {
      this.gameTime = message.gameTime;
      this.pushMessage.next(JSON.stringify({status: 'Ok'}));
    } else {
      this.throwError.next('error: wrong data');
    }
  };

  private gameOverSubscription: Subscription = new Subscription();
  private gameTime = 0;
  private caughtObjects = 0;
  private pushMessage: Subject<string> = new Subject<string>();
  private throwError: Subject<string> = new Subject<string>();

  private pushMessagesEmulator() {
    this.gameOverSubscription = timer(1000, 1000).pipe(map(sc => this.gameTime - sc)).subscribe((sc) => {
      this.pushMessage.next(JSON.stringify(new SocketResponse(sc, this.caughtObjects)));
    });
  }
}
