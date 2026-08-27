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
    this.cloudImage = game.assets.loadImage('cloud', './assets/Nuvem.png');
    this.platformImage = game.assets.loadImage(
      'grass-platform',
      './assets/Design%20sem%20nome%20(1).png',
    );
    this.cloudStartY = -450;
    this.clouds = [
      { x: 40, y: -490, width: 150, height: 77 },
      { x: 575, y: -735, width: 115, height: 59 },
    ];
    this.platforms = [
      new Platform(0, 416, this.worldWidth, 34, this.platformImage),
      new Platform(80, 350, 150, 18, this.platformImage),
      new Platform(330, 260, 150, 18, this.platformImage),
      new Platform(170, 170, 150, 18, this.platformImage),
      new Platform(420, 80, 150, 18, this.platformImage),
      new Platform(100, -10, 150, 18, this.platformImage),
      new Platform(350, -100, 150, 18, this.platformImage),
      new Platform(200, -190, 150, 18, this.platformImage),
      new Platform(460, -280, 150, 18, this.platformImage),
      new Platform(120, -370, 150, 18, this.platformImage),
      new Platform(380, -460, 150, 18, this.platformImage),
      new Platform(240, -550, 150, 18, this.platformImage),
      new Platform(470, -640, 150, 18, this.platformImage),
      new Platform(150, -730, 150, 18, this.platformImage),
      new Platform(390, -820, 150, 18, this.platformImage),
    ];
    this.questionBlocks = [
      new QuestionBlock(378, 226, {
        text: 'O que sera impresso?\n\nprint(2 + 3 * 4)\n\nDigite apenas o numero:',
        answer: '14',
      }),
      new QuestionBlock(218, -44, {
        text: 'O que sera impresso?\n\nprint("Py" + "thon")\n\nDigite a palavra:',
        answer: 'Python',
      }),
      new QuestionBlock(508, -314, {
        text: 'O que sera impresso?\n\nprint(len("jogo"))\n\nDigite apenas o numero:',
        answer: '4',
      }),
      new QuestionBlock(288, -584, {
        text: 'O que sera impresso?\n\nprint(10 // 3)\n\nDigite apenas o numero:',
        answer: '3',
      }),
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
    this.renderSky(context);

    context.save();
    context.translate(0, -this.cameraY);
    this.renderClouds(context);
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
    const answer = window.prompt(`QUESTAO PYTHON\n\n${block.question.text}`);

    if (answer?.trim() === block.question.answer) {
      block.used = true;
      this.score += 100;
      window.alert('Correto! +100 pontos');
    } else {
      window.alert('Resposta incorreta. Tente o proximo bloco!');
    }

    this.game.input.clear();
  }

  renderSky(context) {
    const skyStops = [
      { progress: 0, horizon: [184, 229, 245], zenith: [83, 162, 218] },
      { progress: 0.25, horizon: [128, 199, 237], zenith: [65, 108, 190] },
      { progress: 0.5, horizon: [74, 158, 224], zenith: [30, 54, 137] },
      { progress: 0.75, horizon: [33, 82, 153], zenith: [8, 21, 64] },
      { progress: 1, horizon: [9, 17, 31], zenith: [1, 2, 8] },
    ];
    const progress = Math.max(0, Math.min(1, (300 - this.player.y) / 1120));
    const scaledProgress = progress * (skyStops.length - 1);
    const stopIndex = Math.min(skyStops.length - 2, Math.floor(scaledProgress));
    const blend = scaledProgress - stopIndex;
    const currentStop = skyStops[stopIndex];
    const nextStop = skyStops[stopIndex + 1];
    const horizon = this.blendColors(currentStop.horizon, nextStop.horizon, blend);
    const zenith = this.blendColors(currentStop.zenith, nextStop.zenith, blend);
    const gradient = context.createLinearGradient(0, 0, 0, this.game.canvas.height);

    gradient.addColorStop(0, `rgb(${zenith.join(', ')})`);
    gradient.addColorStop(1, `rgb(${horizon.join(', ')})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  blendColors(startColor, endColor, amount) {
    return startColor.map((channel, index) =>
      Math.round(channel + (endColor[index] - channel) * amount),
    );
  }

  renderClouds(context) {
    if (!this.cloudImage.complete || this.cloudImage.naturalWidth === 0) {
      return;
    }

    for (const cloud of this.clouds) {
      if (cloud.y > this.cloudStartY) {
        continue;
      }

      context.drawImage(
        this.cloudImage,
        cloud.x,
        cloud.y,
        cloud.width,
        cloud.height,
      );
    }
  }

  updateCamera() {
    const viewportHeight = this.game.canvas.height;
    const targetCameraY = this.player.y - viewportHeight * 0.55;
    const clampedCameraY = Math.max(this.worldTop, Math.min(0, targetCameraY));

    this.cameraY += (clampedCameraY - this.cameraY) * 0.12;
  }
}