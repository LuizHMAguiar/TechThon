import { Game } from './Game.js';

const canvas = document.querySelector('#game');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas do jogo nao foi encontrado.');
}

const game = new Game(canvas);
game.start();