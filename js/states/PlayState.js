import { Platform } from '../entities/Platform.js';
import { Player } from '../entities/Player.js';
import { QuestionBlock } from '../entities/QuestionBlock.js';
import { intersects } from '../core/Physics.js';

export class PlayState {
  constructor(game) {
    this.game = game;
    this.player = new Player(80, 300);
    this.score = 0;
    this.platforms = [
      new Platform(0, 416, 800, 34),
      new Platform(60, 360, 130),
      new Platform(210, 310, 130),
      new Platform(360, 260, 130),
      new Platform(510, 210, 130),
      new Platform(660, 160, 120),
    ];
    this.questionBlocks = [
      new QuestionBlock(258, 276),
      new QuestionBlock(558, 176),
    ];
  }

  enter() {}

  exit() {}

  update(deltaTime) {
    this.player.update(deltaTime, this.game.input, this.game.canvas, this.platforms);

    for (const block of this.questionBlocks) {
      if (!block.used && !block.questionAsked && intersects(this.player, block)) {
        this.openQuestion(block);
      }
    }
  }

  render(context) {
    context.fillStyle = '#77c9f2';
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this.renderBackground(context);
    for (const platform of this.platforms) platform.render(context);
    for (const block of this.questionBlocks) block.render(context);
    this.player.render(context);

    context.fillStyle = '#ffffff';
    context.font = 'bold 18px monospace';
    context.textAlign = 'left';
    context.fillText(`PONTOS: ${this.score}`, 18, 30);
    context.font = '14px monospace';
    context.fillText('SETAS/WASD: mover  ESPACO: pular', 18, 52);
  }

  openQuestion(block) {
    block.questionAsked = true;
    const answer = window.prompt(
      'QUESTAO PYTHON\n\nO que sera impresso?\n\nprint(2 ** 3)\n\nDigite apenas o numero:',
    );

    if (answer?.trim() === '8') {
      block.used = true;
      this.score += 100;
      window.alert('Correto! +100 pontos');
    } else {
      window.alert('Resposta incorreta. Tente o proximo bloco!');
    }

    this.game.input.clear();
  }

  renderBackground(context) {
    context.fillStyle = '#fff4b8';
    context.fillRect(0, 385, this.game.canvas.width, 31);
    context.fillStyle = '#ffffff';
    context.fillRect(90, 85, 78, 16);
    context.fillRect(115, 72, 42, 29);
    context.fillRect(620, 110, 92, 15);
    context.fillRect(650, 95, 45, 30);
  }
}