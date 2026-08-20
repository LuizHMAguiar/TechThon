export class MenuState {
  constructor(game) {
    this.game = game;
  }

  enter() {}

  exit() {}

  update() {
    if (this.game.input.isDown('enter') || this.game.input.pointer.pressed) {
      this.game.changeState('play');
    }
  }

  render(context) {
    context.fillStyle = '#77c9f2';
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
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