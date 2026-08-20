import { Platform } from '../entities/Platform.js';
import { Player } from '../entities/Player.js';
import { QuestionBlock } from '../entities/QuestionBlock.js';
import { intersects } from '../core/Physics.js';

export class PlayState {
  constructor(game) {
    this.game = game;
    this.player = new Player(80, 300);
    this.score = 0;
    this.cameraY = 0;
    this.worldWidth = 800;
    this.worldTop = -900;
    this.platforms = [
      new Platform(0, 416, this.worldWidth, 34),
      new Platform(80, 350, 150),
      new Platform(330, 260, 150),
      new Platform(170, 170, 150),
      new Platform(420, 80, 150),
      new Platform(100, -10, 150),
      new Platform(350, -100, 150),
      new Platform(200, -190, 150),
      new Platform(460, -280, 150),
      new Platform(120, -370, 150),
      new Platform(380, -460, 150),
      new Platform(240, -550, 150),
      new Platform(470, -640, 150),
      new Platform(150, -730, 150),
      new Platform(390, -820, 150),
    ];
    this.questionBlocks = [
      new QuestionBlock(378, 226),
      new QuestionBlock(218, -44),
      new QuestionBlock(508, -314),
      new QuestionBlock(288, -584),
    ];
  }

  enter() {}

  exit() {}

  update(deltaTime) {
    this.player.update(
      deltaTime,
      this.game.input,
      this.game.canvas,
      this.platforms,
      this.worldWidth,
    );
    this.updateCamera();

    for (const block of this.questionBlocks) {
      if (!block.used && !block.questionAsked && intersects(this.player, block)) {
        this.openQuestion(block);
      }
    }
  }

  render(context) {
    context.fillStyle = '#77c9f2';
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    context.save();
    context.translate(0, -this.cameraY);
    this.renderBackground(context);
    for (const platform of this.platforms) platform.render(context);
    for (const block of this.questionBlocks) block.render(context);
    this.player.render(context);
    context.restore();

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
    context.fillRect(0, 385, this.worldWidth, 31);
    context.fillStyle = '#ffffff';
    context.fillRect(90, 85, 78, 16);
    context.fillRect(115, 72, 42, 29);
    context.fillRect(590, 10, 92, 15);
    context.fillRect(620, -5, 45, 30);
    context.fillRect(70, -230, 78, 16);
    context.fillRect(95, -243, 42, 29);
  }

  updateCamera() {
    const viewportHeight = this.game.canvas.height;
    const targetCameraY = this.player.y - viewportHeight * 0.55;
    const clampedCameraY = Math.max(this.worldTop, Math.min(0, targetCameraY));

    this.cameraY += (clampedCameraY - this.cameraY) * 0.12;
  }
}