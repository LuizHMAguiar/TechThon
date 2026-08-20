import { Assets } from './core/Assets.js';
import { Input } from './core/Input.js';
import { MenuState } from './states/MenuState.js';
import { PlayState } from './states/PlayState.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;
    this.input = new Input(canvas);
    this.assets = new Assets();
    this.states = {
      menu: new MenuState(this),
      play: new PlayState(this),
    };
    this.currentState = this.states.menu;
    this.lastTime = 0;
    this.frameId = null;
  }

  start() {
    this.currentState.enter();
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  loop(time) {
    const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.currentState.update(deltaTime);
    this.currentState.render(this.context);
    this.frameId = requestAnimationFrame((nextTime) => this.loop(nextTime));
  }

  changeState(stateName) {
    const nextState = this.states[stateName];

    if (!nextState || nextState === this.currentState) {
      return;
    }

    this.currentState.exit();
    this.currentState = nextState;
    this.currentState.enter();
  }
}