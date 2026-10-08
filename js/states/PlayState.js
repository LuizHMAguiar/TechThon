import { Platform } from '../entities/Platform.js';
import { Player } from '../entities/Player.js';
import { QuestionBlock } from '../entities/QuestionBlock.js';
import { Coin } from '../entities/Coin.js';
import { Plant } from '../entities/Plant.js';
import { intersects } from '../core/Physics.js';

export class PlayState {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.gameOver = false;
    this.questionScreen = null;
    this.answerInput = '';
    this.questionResult = null;
    this.cameraY = 0;
    this.worldWidth = 800;
    this.worldTop = -1720;
    this.cloudImage = game.assets.loadImage('cloud', './assets/Nuvem.png');
    this.platformImage = game.assets.loadImage(
      'grass-platform',
      './assets/plataforma.png',
    );
    this.playerImage = game.assets.loadImage('player', './assets/perso.png');
    this.groundImage = game.assets.loadImage('ground', './assets/chao.png');
    this.starImage = game.assets.loadImage('question-star', './assets/estrela.png');
    this.coinImage = game.assets.loadImage('coin', './assets/mo.png');
    this.plantImage = game.assets.loadImage('plant', './assets/planta.png');
    this.treeImage = game.assets.loadImage('tree', './assets/ar.png');
    this.castleImage = game.assets.loadImage('castle', './assets/c.png');
    this.answerField = document.querySelector('#answer-input');
    this.player = new Player(80, 374, this.playerImage);
    this.cloudStartY = -450;
    this.clouds = [
      { x: 40, y: 20, width: 150, height: 77 },
      { x: 610, y: 80, width: 150, height: 77 },
      { x: 540, y: -120, width: 150, height: 77 },
      { x: 20, y: -300, width: 150, height: 77 },
      { x: 590, y: -480, width: 150, height: 77 },
      { x: 40, y: -660, width: 150, height: 77 },
      { x: 600, y: -840, width: 150, height: 77 },
      { x: 10, y: -1020, width: 150, height: 77 },
      { x: 580, y: -1200, width: 150, height: 77 },
    ];
    this.platforms = [
      new Platform(0, 408, 240, 42, this.groundImage, true),
      new Platform(160, 408, 240, 42, this.groundImage, true),
      new Platform(320, 408, 240, 42, this.groundImage, true),
      new Platform(480, 408, 240, 42, this.groundImage, true),
      new Platform(640, 408, 240, 42, this.groundImage, true),
      new Platform(180, 320, 130, 34, this.platformImage),
      new Platform(330, 210, 130, 34, this.platformImage),
      new Platform(170, 100, 130, 34, this.platformImage),
      new Platform(320, -10, 130, 34, this.platformImage),
      new Platform(100, -120, 130, 34, this.platformImage),
      new Platform(350, -230, 130, 34, this.platformImage),
      new Platform(200, -340, 130, 34, this.platformImage),
      new Platform(450, -450, 130, 34, this.platformImage),
      new Platform(350, -560, 130, 34, this.platformImage),
      new Platform(500, -670, 130, 34, this.platformImage),
      new Platform(300, -780, 130, 34, this.platformImage),
      new Platform(430, -890, 130, 34, this.platformImage),
      new Platform(180, -1000, 130, 34, this.platformImage),
      new Platform(350, -1110, 130, 34, this.platformImage),
      new Platform(120, -1220, 130, 34, this.platformImage),
      new Platform(300, -1330, 130, 34, this.platformImage),
      new Platform(520, -1440, 130, 34, this.platformImage),
      new Platform(230, -1550, 130, 34, this.platformImage),
      new Platform(470, -1660, 130, 34, this.platformImage),
    ];
    this.questionBlocks = [
      new QuestionBlock(378, 176, {
        text: 'O que sera impresso?\n\nprint(2 + 3 * 4)\n\nDigite apenas o numero:',
        answer: '14',
      }, this.starImage),
      new QuestionBlock(148, -154, {
        text: 'O que sera impresso?\n\nprint(5 + 2)\n\nDigite apenas o numero:',
        answer: '7',
      }, this.starImage),
      new QuestionBlock(498, -484, {
        text: 'O que sera impresso?\n\nprint(len("jogo"))\n\nDigite apenas o numero:',
        answer: '4',
      }, this.starImage),
      new QuestionBlock(348, -814, {
        text: 'O que sera impresso?\n\nprint(10 // 3)\n\nDigite apenas o numero:',
        answer: '3',
      }, this.starImage),
    ];
    this.coins = [
      new Coin(180 + 65, 320 - 25, this.coinImage),
      new Coin(170 + 65, 100 - 25, this.coinImage),
      new Coin(320 + 65, -10 - 25, this.coinImage),
      new Coin(430 + 65, -890 - 25, this.coinImage),
      new Coin(430 + 65, -1660 - 25, this.coinImage),
    ];
    this.plants = [
      new Plant(340, -274, this.plantImage),
      new Plant(200, -447, this.plantImage),
      new Plant(335, -620, this.plantImage),
      new Plant(170, -1055, this.plantImage),
      new Plant(300, -1390, this.plantImage),
      new Plant(230, -1620, this.plantImage),
    ];
    this.questionKeyHandler = (event) => {
      if (!this.questionScreen) {
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        this.submitQuestion();
      } else if (event.target === this.answerField) {
        return;
      } else if (event.key === 'Backspace' && !this.questionResult) {
        event.preventDefault();
        this.answerInput = this.answerInput.slice(0, -1);
      } else if (event.key.length === 1 && !this.questionResult) {
        event.preventDefault();
        this.answerInput += event.key;
      }
    };
    this.answerField?.addEventListener('input', (event) => {
      this.answerInput = event.target.value;
    });
    window.addEventListener('keydown', this.questionKeyHandler);
  }

  enter() {
    this.reset();
  }

  exit() {}

  update(deltaTime) {
    if (this.questionScreen) {
      return;
    }

    if (this.gameOver) {
      if (this.game.input.isDown('enter') || this.game.input.pointer.pressed) {
        this.reset();
        this.game.input.clear();
      }
      return;
    }

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

    for (const coin of this.coins) {
      coin.update(deltaTime);
      if (!coin.collected && intersects(this.player, coin)) {
        coin.collect();
        this.score += 10;
      }
    }

    for (const plant of this.plants) {
      if (intersects(this.player, plant)) {
        this.gameOver = true;
        this.game.input.clear();
        break;
      }
    }
  }

  render(context) {
    this.renderSky(context);

    context.save();
    context.translate(0, -this.cameraY);
    this.renderScenery(context);
    this.renderClouds(context);
    for (const platform of this.platforms) platform.render(context);
    for (const coin of this.coins) coin.render(context);
    for (const block of this.questionBlocks) block.render(context);
    for (const plant of this.plants) plant.render(context);
    this.player.render(context);
    context.restore();

    context.fillStyle = '#ffffff';
    context.font = 'bold 18px monospace';
    context.textAlign = 'left';
    context.fillText(`PONTOS: ${this.score}`, 18, 30);
    context.font = '14px monospace';
    context.fillText('SETAS/WASD: mover  ESPACO: pular', 18, 52);

    if (this.gameOver) {
      context.fillStyle = 'rgba(20, 15, 30, 0.78)';
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.font = 'bold 42px monospace';
      context.fillText('VOCE PERDEU!', this.game.canvas.width / 2, 190);
      context.font = '18px monospace';
      context.fillText('Enter ou clique para tentar novamente', this.game.canvas.width / 2, 235);
    }

    if (this.questionScreen) {
      this.renderQuestionScreen(context);
    }
  }

  reset() {
    this.score = 0;
    this.gameOver = false;
    this.questionScreen = null;
    this.answerInput = '';
    this.questionResult = null;
    if (this.answerField) {
      this.answerField.value = '';
      this.answerField.hidden = true;
      this.answerField.disabled = false;
    }
    this.cameraY = 0;
    this.player.x = 80;
    this.player.y = 374;
    this.player.velocityY = 0;
    this.player.grounded = false;
    this.player.jumpsRemaining = 1;
    for (const coin of this.coins) {
      coin.collected = false;
      coin.collectTime = 0;
      coin.y = coin.baseY;
    }
    for (const block of this.questionBlocks) {
      block.used = false;
      block.questionAsked = false;
    }
  }

  openQuestion(block) {
    block.questionAsked = true;
    this.questionScreen = block;
    this.answerInput = '';
    this.questionResult = null;
    if (this.answerField) {
      this.answerField.value = '';
      this.answerField.hidden = false;
      this.answerField.disabled = false;
      this.answerField.focus();
    }
    this.game.input.clear();
  }

  submitQuestion() {
    if (this.questionResult) {
      this.questionScreen = null;
      this.answerInput = '';
      this.questionResult = null;
      if (this.answerField) {
        this.answerField.value = '';
        this.answerField.hidden = true;
        this.answerField.disabled = false;
      }
      this.game.input.clear();
      return;
    }

    if (this.answerInput.trim() === this.questionScreen.question.answer) {
      this.questionScreen.used = true;
      this.score += 100;
      this.questionResult = 'Correto! +100 pontos';
    } else {
      this.questionResult = 'Resposta incorreta. Tente o proximo bloco!';
    }
    if (this.answerField) {
      this.answerField.disabled = true;
    }
  }

  renderQuestionScreen(context) {
    const questionLines = this.questionScreen.question.text.split('\n');
    const codeLine = questionLines.find((line) => line.trim().startsWith('print')) || '';

    context.fillStyle = '#d9f4fc';
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    context.fillStyle = '#f8fbff';
    context.fillRect(0, 12, this.game.canvas.width, 398);
    context.strokeStyle = '#1c6fd1';
    context.lineWidth = 3;
    context.strokeRect(2, 12, this.game.canvas.width - 4, 398);
    context.fillStyle = '#122d73';
    context.textAlign = 'left';
    context.font = 'bold 25px monospace';
    context.fillText('Qual e o resultado do codigo abaixo?', 16, 61);

    context.fillStyle = '#173b70';
    context.fillRect(8, 82, this.game.canvas.width - 16, 136);
    context.fillStyle = '#b9cbea';
    context.font = 'bold 20px monospace';
    context.fillText('1 |', 34, 122);
    context.fillText('2 |', 34, 160);
    context.fillText('3 |', 34, 198);
    context.fillStyle = '#ffffff';
    context.font = 'bold 19px monospace';
    context.fillText(codeLine, 86, 160);

    context.strokeStyle = '#3578d4';
    context.lineWidth = 2;
    context.strokeRect(8, 242, this.game.canvas.width - 16, 64);
    context.fillStyle = '#2478ed';
    context.fillRect(518, 320, 254, 68);
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = 'bold 20px monospace';
    context.fillText('ENVIAR  ▶', 645, 361);

    context.fillStyle = '#5576ac';
    context.font = '14px monospace';
    if (this.questionResult) {
      context.fillStyle = this.questionResult.startsWith('Correto') ? '#147a36' : '#a32626';
      context.fillText(this.questionResult, this.game.canvas.width / 2, 405);
      context.fillStyle = '#5576ac';
      context.fillText('Pressione Enter para voltar ao jogo', this.game.canvas.width / 2, 425);
    } else {
      context.fillText('Digite sua resposta e pressione Enter', this.game.canvas.width / 2, 425);
    }
  }

  renderSky(context) {
    context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  renderScenery(context) {
    context.fillStyle = '#8b5a2b';
    context.fillRect(0, 408, this.game.canvas.width, this.game.canvas.height - 408);

    if (this.castleImage.complete && this.castleImage.naturalWidth > 0) {
      const castleHeight = 150;
      const castleWidth = castleHeight * this.castleImage.naturalWidth / this.castleImage.naturalHeight;
      context.drawImage(this.castleImage, 640, 408 - castleHeight, castleWidth, castleHeight);
    }

    if (this.treeImage.complete && this.treeImage.naturalWidth > 0) {
      const treeHeight = 150;
      const treeWidth = treeHeight * this.treeImage.naturalWidth / this.treeImage.naturalHeight;
      context.drawImage(this.treeImage, 0, 408 - treeHeight, treeWidth, treeHeight);
    }
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