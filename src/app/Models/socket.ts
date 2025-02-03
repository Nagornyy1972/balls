export class CaughtObjects {
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}

export class GameTime {
  gameTime: number;

  constructor(gameTime: number) {
    this.gameTime = gameTime;
  }
}

export class SocketResponse {
  timeRemaining: number;
  caughtObjects: number;

  constructor(timeRemaining: number, caughtObjects: number) {
    this.timeRemaining = timeRemaining;
    this.caughtObjects = caughtObjects;
  }
}
