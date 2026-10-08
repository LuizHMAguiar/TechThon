export class MenuState {
  constructor(game) {
    this.game = game;
    this.menuScreen = document.querySelector('#menu-screen');
    this.startButton = document.querySelector('#start-game');
    this.startButton?.addEventListener('click', () => this.game.changeState('play'));
  }

  enter() {
    if (this.menuScreen) {
      this.menuScreen.hidden = false;
    }
  }

  exit() {
    if (this.menuScreen) {
      this.menuScreen.hidden = true;
    }
  }

  update() {
    if (this.game.input.isDown('enter') || this.game.input.pointer.pressed) {
      this.game.changeState('play');
    }
  }

  render(context) {
    context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(90, 95, 78, 16);
    context.fillRect(115, 82, 42, 29);
    context.fillStyle = '#f1faee';
    context.textAlign = 'center';
    context.font = 'bold 42px sans-serif';
    context.fillText('Meu jogo canvas', this.game.canvas.width / 2, 180);
    context.font = '20px sans-serif';
    context.fillText('Pressione Enter ou clique para jogar', this.game.canvas.width / 2, 250);
  }
}