import { Platform } from '../entities/Platform.js';
import { Player } from '../entities/Player.js';
import { QuestionBlock } from '../entities/QuestionBlock.js';
import { Coin } from '../entities/Coin.js';
import { Plant } from '../entities/Plant.js';
import { intersects } from '../core/Physics.js';

const questionProgression = [
  { text: 'Uma pessoa ganha pontos em duas fases. Qual pontuacao aparece?\n\n# Some os pontos das fases\nfase_1 = 2\nfase_2 = 3\npontuacao = fase_1 + fase_2\nprint(pontuacao)\n\nDigite apenas o numero:', answer: '5', codeExplanation: 'Variaveis guardam dados. O sinal = atribui um valor, e print() exibe um valor na tela.', explanation: 'As variaveis guardam 2 e 3. A soma e 5, que e mostrado por print().' },
  { text: 'Uma loja calcula o preco com uma taxa. Qual total aparece?\n\n# A multiplicacao acontece antes da soma\npreco = 8\ntaxa = 2 * 3\ntotal = preco + taxa\nprint(total)\n\nDigite apenas o numero:', answer: '14', codeExplanation: '* representa multiplicacao. Na ordem das operacoes, multiplicacao vem antes de adicao.', explanation: 'A multiplicacao vem primeiro: 2 * 3 = 6. Depois, 8 + 6 = 14.' },
  { text: 'Uma professora divide adesivos entre alunos. Qual resultado da soma do quociente com o resto?\n\n# Divida os adesivos igualmente\nadesivos = 17\nalunos = 5\nquociente = adesivos // alunos\nresto = adesivos % alunos\nprint(quociente + resto)\n\nDigite apenas o numero:', answer: '5', codeExplanation: '// devolve o quociente inteiro de uma divisao; % devolve o resto. Eles ajudam a separar grupos iguais.', explanation: '// retorna o quociente inteiro (3) e % retorna o resto (2). Somando, 3 + 2 = 5.' },
  { text: 'Um projeto ganha pontos de acordo com o tamanho do seu nome. Qual valor aparece?\n\n# len conta as letras do nome\nprojeto = "codigo"\nletras = len(projeto)\npontos = letras * 2 - 3\nprint(pontos)\n\nDigite apenas o numero:', answer: '9', codeExplanation: 'Texto entre aspas e uma string. len(string) conta seus caracteres e devolve essa quantidade como numero.', explanation: 'len("codigo") vale 6. Entao, 6 * 2 - 3 = 9.' },
  { text: 'Um jogador recebe pontos por tarefas e um bonus. Qual pontuacao aparece?\n\n# Resolva primeiro o que esta entre parenteses\nbase = 12\ntarefas = base - 4\npontos = tarefas * 3 + 2\nprint(pontos)\n\nDigite apenas o numero:', answer: '26', codeExplanation: 'Uma variavel pode ser usada em calculos seguintes. Multiplicacao tem prioridade sobre adicao, a menos que parenteses indiquem outra ordem.', explanation: 'Primeiro, 12 - 4 = 8. Depois, 8 * 3 + 2 = 26.' },
  { text: 'Um programa calcula grupos completos e acrescenta um bonus ao quadrado. Qual valor aparece?\n\n# Use divisao inteira e potencia\nitens = 24\ngrupos = itens // 5\nbonus = 3 ** 2\nprint(grupos + bonus)\n\nDigite apenas o numero:', answer: '13', codeExplanation: '// descarta a parte fracionaria da divisao. ** representa potencia: o numero a esquerda e multiplicado por ele mesmo.', explanation: '24 // 5 = 4 grupos completos. 3 ** 2 = 9; 4 + 9 = 13.' },
  { text: 'Um jogo calcula o bonus usando o resto de uma potencia e uma divisao inteira. Qual valor aparece?\n\n# Calcule cada parte antes de somar\npotencia = 7 ** 2\nresto = potencia % 10\ngrupo = 18 // 4\nprint(resto + grupo)\n\nDigite apenas o numero:', answer: '13', codeExplanation: '** calcula potencia; % encontra o resto de uma divisao; // retorna o quociente inteiro. Os valores podem ser guardados em variaveis.', explanation: '7 ** 2 = 49; 49 % 10 = 9. Tambem, 18 // 4 = 4; 9 + 4 = 13.' },
  { text: 'Uma equipe ganha pontos por tarefas, grupos completos e bonus. Qual pontuacao aparece?\n\n# Combine subtracao, divisao e multiplicacao\ntarefas = 15 - 3\ngrupos = 8 // 4\nbonus = 7\nprint(tarefas * grupos + bonus)\n\nDigite apenas o numero:', answer: '31', codeExplanation: 'Cada atribuicao guarda o resultado de uma expressao. Em expressoes mistas, multiplicacao e divisao acontecem antes da adicao.', explanation: 'tarefas vale 12 e grupos vale 2. Entao, 12 * 2 + 7 = 31.' },
  { text: 'Uma loja calcula o preco final usando potencia, resto e multiplicacao. Qual total aparece?\n\n# Calcule o preco e as unidades restantes\npreco = 5 ** 2\nrestantes = 17 % 6\nquantidade = 3\nprint(preco + restantes * quantidade)\n\nDigite apenas o numero:', answer: '40', codeExplanation: '** calcula potencia e % calcula resto. Na ultima expressao, a multiplicacao tem prioridade sobre a adicao.', explanation: '5 ** 2 = 25; 17 % 6 = 5. O total e 25 + 5 * 3 = 40.' },
  { text: 'Um programa calcula pontos pelo tamanho do nome e desconta uma penalidade. Qual resultado aparece?\n\n# Combine len, potencia, multiplicacao e subtracao\ndispositivo = "computador"\nletras = len(dispositivo)\npenalidade = 2 ** 2\nprint(letras * 3 - penalidade)\n\nDigite apenas o numero:', answer: '26', codeExplanation: 'len() conta os caracteres de uma string. ** calcula potencia; depois, multiplicacao e subtracao seguem a ordem das operacoes.', explanation: 'computador tem 10 letras e 2 ** 2 = 4. Assim, 10 * 3 - 4 = 26.' },
  { text: 'Um desafio combina potencia, divisao inteira, resto e multiplicacao. Qual resultado aparece?\n\n# Resolva as operacoes na ordem correta\npontos = 9 ** 2 // 5\nresto = 23 % 7\nbonus = resto * 2\nprint(pontos + bonus)\n\nDigite apenas o numero:', answer: '20', codeExplanation: 'Potencia e resolvida antes de // ou %. A multiplicacao tambem tem prioridade sobre adicao; parenteses podem alterar essa ordem.', explanation: '9 ** 2 // 5 = 16; 23 % 7 = 2; o bonus e 2 * 2 = 4. Total: 16 + 4 = 20.' },
  { text: 'Desafio final: uma pontuacao combina varias operacoes e valores intermediarios. Qual resultado aparece?\n\n# Calcule os valores intermediarios primeiro\nbase = 6 ** 2\nparte_a = (base + 8) // 5\nparte_b = 29 % 6\nparte_c = parte_b * 3\nprint(parte_a + parte_c - 2)\n\nDigite apenas o numero:', answer: '21', codeExplanation: 'Expressoes podem ser divididas em etapas com variaveis. Parenteses definem a ordem; depois, potencia, divisao, multiplicacao e soma/subtracao seguem suas prioridades.', explanation: 'base vale 36; parte_a vale 8; parte_b vale 5 e parte_c vale 15. O resultado e 8 + 15 - 2 = 21.' },
];

function getQuestion(index) {
  if (index < questionProgression.length) {
    return questionProgression[index];
  }

  const challenge = index - questionProgression.length + 1;
  const template = (challenge - 1) % 4;
  if (template === 0) {
    const base = challenge + 10;
    const bonus = challenge * 2;
    return {
      text: `Desafio extra ${challenge}: qual pontuacao aparece?\n\n# Some a base e o bonus\nbase = ${base}\nbonus = ${bonus}\nprint(base + bonus)\n\nDigite apenas o numero:`,
      answer: String(base + bonus),
      codeExplanation: 'As variaveis guardam valores. O operador + soma os valores usados na expressao de print().',
      explanation: `${base} + ${bonus} = ${base + bonus}.`,
    };
  }

  if (template === 1) {
    const grupos = challenge + 3;
    const bonus = challenge;
    const answer = grupos * 4 + bonus;
    return {
      text: `Desafio extra ${challenge}: quantos pontos aparecem?\n\n# Multiplique os grupos e some o bonus\ngrupos = ${grupos}\nbonus = ${bonus}\nprint(grupos * 4 + bonus)\n\nDigite apenas o numero:`,
      answer: String(answer),
      codeExplanation: 'A multiplicacao acontece antes da soma. Resolva grupos * 4 e depois acrescente o bonus.',
      explanation: `${grupos} * 4 + ${bonus} = ${answer}.`,
    };
  }

  if (template === 2) {
    const itens = challenge * 3 + 17;
    const caixas = 5;
    const answer = Math.floor(itens / caixas) + (itens % caixas);
    return {
      text: `Desafio extra ${challenge}: qual resultado aparece?\n\n# Some os grupos completos e o resto\nitens = ${itens}\ncaixas = ${caixas}\ngrupo = itens // caixas\nresto = itens % caixas\nprint(grupo + resto)\n\nDigite apenas o numero:`,
      answer: String(answer),
      codeExplanation: '// encontra os grupos completos e % encontra o resto da divisao.',
      explanation: `${itens} // ${caixas} = ${Math.floor(itens / caixas)} e ${itens} % ${caixas} = ${itens % caixas}. A soma e ${answer}.`,
    };
  }

  const pontos = challenge + 20;
  const answer = pontos + challenge ** 2;
  return {
    text: `Desafio extra ${challenge}: qual pontuacao aparece?\n\n# Calcule a potencia antes da soma\npontos = ${pontos}\nbonus = ${challenge} ** 2\nprint(pontos + bonus)\n\nDigite apenas o numero:`,
    answer: String(answer),
    codeExplanation: '** calcula potencia antes da soma. Depois, some o resultado de bonus a pontos.',
    explanation: `${challenge} ** 2 = ${challenge ** 2}; ${pontos} + ${challenge ** 2} = ${answer}.`,
  };
}

export class PlayState {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.gameOver = false;
    this.questionScreen = null;
    this.answerInput = '';
    this.questionResult = null;
    this.questionRotation = 0;
    this.cameraY = 0;
    this.worldWidth = 800;
    this.worldTop = -1720;
    this.elapsedTime = 0;
    this.blackHole = { x: 590, y: -5200, pullRadius: 280, eventHorizon: 46 };
    this.blackHoleDistance = Infinity;
    this.blackHoleCaptured = false;
    this.cloudImage = game.assets.loadImage('cloud', './assets/Nuvem.png');
    this.platformImage = game.assets.loadImage(
      'grass-platform',
      './assets/plataforma.png',
    );
    this.playerImage = game.assets.loadImage('player', './assets/perso.png');
    this.groundImage = game.assets.loadImage('ground', './assets/chao.png');
    this.questionBackgroundImage = game.assets.loadImage('question-background', './assets/1.png');
    this.starImage = game.assets.loadImage('question-star', './assets/estrela.png');
    this.sendButtonImage = game.assets.loadImage('send-button', './assets/enviar.png');
    this.coinImage = game.assets.loadImage('coin', './assets/mo.png');
    this.cofImage = game.assets.loadImage('cof', './assets/cof.png');
    this.shopDialog = document.querySelector('#shop-dialog');
    this.closeShopButton = document.querySelector('#close-shop');
    this.settingsDialog = document.querySelector('#settings-dialog');
    this.closeSettingsButton = document.querySelector('#close-settings');
    this.openShopButton = document.querySelector('#open-shop');
    this.tutorialToggle = document.querySelector('#tutorial-toggle');
    this.tutorialHints = document.querySelector('#tutorial-hints');
    this.tutorialEnabled = false;
    this.soundToggle = document.querySelector('#sound-toggle');
    this.soundEnabled = true;
    this.musicToggle = document.querySelector('#music-toggle');
    this.musicEnabled = true;
    this.audioContext = null;
    this.audioUnavailable = false;
    this.backgroundMusicBuffer = null;
    this.backgroundMusicSource = null;
    this.backgroundMusicGain = null;
    this.doubtDialog = document.querySelector('#doubt-dialog');
    this.doubtTopics = document.querySelector('#doubt-topics');
    this.doubtHint = document.querySelector('#doubt-hint');
    this.closeDoubtButton = document.querySelector('#close-doubt');
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
      new Platform(0, 408, 800, 42, this.groundImage, true),
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
    this.nextPlatformY = Math.min(...this.platforms.map((platform) => platform.y)) - 110;
    this.generatedPlatformXs = [320, 170, 320, 470, 620, 470];
    this.generatedPlatformIndex = 0;
    this.questionBlocks = [
      this.createQuestionBlock(218, 66, 0),
      this.createQuestionBlock(398, -594, 1),
      this.createQuestionBlock(168, -1254, 2),
      this.createQuestionBlock(518, -1694, 3),
    ];
    this.coins = [
      new Coin(180 + (130 - 22) / 2, 320 - 25, this.coinImage),
      new Coin(200 + (130 - 22) / 2, -340 - 25, this.coinImage),
      new Coin(180 + (130 - 22) / 2, -1000 - 25, this.coinImage),
    ];
    this.plants = [
      new Plant(151, -163, this.plantImage),
      new Plant(351, -823, this.plantImage),
      new Plant(571, -1483, this.plantImage),
    ];
    this.questionKeyHandler = (event) => {
      if (!this.questionScreen) {
        return;
      }

      if (this.doubtDialog?.open) {
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
    this.doubtPointerHandler = () => {
      if (!this.questionScreen || this.doubtDialog?.open || this.shopDialog?.open) {
        return;
      }

      const bounds = this.getHydrantBounds();
      const { x, y } = this.game.input.pointer;
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
        y >= bounds.y && y <= bounds.y + bounds.height) {
        this.doubtDialog?.showModal();
      }
    };
    this.questionPointerHandler = () => {
      if (!this.questionScreen) {
        return;
      }

      const button = this.getQuestionButtonBounds();
      const { x, y } = this.game.input.pointer;
      if (x >= button.x && x <= button.x + button.width &&
        y >= button.y && y <= button.y + button.height) {
        this.submitQuestion();
      }
    };
    this.settingsPointerHandler = () => {
      if (this.questionScreen || !this.settingsDialog || this.settingsDialog.open || this.shopDialog?.open) {
        return;
      }

      const { x, y, width, height } = this.getShopIconBounds();
      const pointer = this.game.input.pointer;
      if (pointer.x >= x && pointer.x <= x + width &&
        pointer.y >= y && pointer.y <= y + height) {
        this.settingsDialog.showModal();
      }
    };
    this.closeShopButton?.addEventListener('click', () => this.shopDialog?.close());
    this.closeSettingsButton?.addEventListener('click', () => this.settingsDialog?.close());
    this.openShopButton?.addEventListener('click', () => {
      this.settingsDialog?.close();
      this.shopDialog?.classList.add('shop-dialog--expanded');
      this.shopDialog?.showModal();
      this.closeShopButton?.focus();
    });
    this.tutorialToggle?.addEventListener('click', () => {
      this.setTutorialEnabled(!this.tutorialEnabled);
    });
    this.soundToggle?.addEventListener('click', () => {
      this.setSoundEnabled(!this.soundEnabled);
    });
    this.musicToggle?.addEventListener('click', () => {
      this.setMusicEnabled(!this.musicEnabled);
    });
    this.shopDialog?.addEventListener('close', () => {
      this.shopDialog.classList.remove('shop-dialog--expanded');
    });
    const closeDoubtDialog = () => this.doubtDialog?.close();
    this.closeDoubtButton?.addEventListener('click', closeDoubtDialog);
    this.doubtTopics?.addEventListener('click', (event) => {
      const topicButton = event.target.closest('button[data-hint]');
      if (!topicButton || !this.doubtHint) {
        return;
      }

      this.doubtTopics.querySelectorAll('button[data-hint]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button === topicButton));
      });
      this.doubtHint.textContent = topicButton.dataset.hint;
      this.doubtHint.hidden = false;
    });
    this.answerField?.addEventListener('input', (event) => {
      this.answerInput = event.target.value;
    });
    window.addEventListener('keydown', this.questionKeyHandler);
    this.game.canvas.addEventListener('click', this.questionPointerHandler);
    this.game.canvas.addEventListener('click', this.settingsPointerHandler);
    this.game.canvas.addEventListener('click', this.doubtPointerHandler);
  }

  enter() {
    this.setTutorialEnabled(false);
    if (this.soundEnabled || this.musicEnabled) {
      this.getAudioContext();
    }
    if (this.musicEnabled) {
      this.startBackgroundMusic();
    }
    this.reset();
  }

  exit() {
    this.shopDialog?.close();
    this.settingsDialog?.close();
    this.setTutorialEnabled(false);
    this.stopBackgroundMusic();
    if (this.audioContext?.state === 'running') {
      this.audioContext.suspend().catch((error) => {
        console.error('Não foi possível pausar o áudio do jogo.', error);
      });
    }
  }

  update(deltaTime) {
    if (this.tutorialHints) {
      this.tutorialHints.hidden = !this.tutorialEnabled || Boolean(this.questionScreen);
    }

    if (this.shopDialog?.open || this.settingsDialog?.open) {
      return;
    }

    if (this.questionScreen) {
      return;
    }

    if (this.gameOver) {
      if (this.game.input.isDown('enter') || this.game.input.pointer.pressed) {
        this.questionRotation = Math.min(
          this.questionRotation + 1,
          questionProgression.length - 1,
        );
        this.reset();
        this.game.input.clear();
      }
      return;
    }

    this.elapsedTime += deltaTime;
    const jumped = this.player.update(
      deltaTime,
      this.game.input,
      this.game.canvas,
      this.platforms,
      this.worldWidth,
    );
    if (jumped) {
      this.playSound(520, 0.1);
    }
    this.generatePlatformsAhead();
    this.updateBlackHole(deltaTime);
    this.updateCamera();
    if (this.gameOver) {
      return;
    }
    for (const block of this.questionBlocks) {
      block.update(deltaTime);
      if (!block.used && !block.questionAsked && intersects(this.player, block)) {
        this.openQuestion(block);
      }
    }

    for (const coin of this.coins) {
      coin.update(deltaTime);
      if (!coin.collected && intersects(this.player, coin)) {
        coin.collect();
        this.score += 10;
        this.playSound(880, 0.12);
      }
    }

    for (const plant of this.plants) {
      plant.update(deltaTime);
      if (intersects(this.player, plant)) {
        this.gameOver = true;
        this.playSound(180, 0.3);
        this.game.input.clear();
        break;
      }
    }
  }

  setTutorialEnabled(enabled) {
    this.tutorialEnabled = enabled;
    if (this.tutorialToggle) {
      this.tutorialToggle.setAttribute('aria-pressed', String(enabled));
      this.tutorialToggle.textContent = `TUTORIAL: ${enabled ? 'LIGADO' : 'DESLIGADO'}`;
    }
    if (this.tutorialHints) {
      this.tutorialHints.hidden = !enabled || Boolean(this.questionScreen);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (this.soundToggle) {
      this.soundToggle.setAttribute('aria-pressed', String(enabled));
      this.soundToggle.textContent = `EFEITOS: ${enabled ? 'LIGADOS' : 'DESLIGADOS'}`;
    }

    this.updateAudioPlayback();
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (this.musicToggle) {
      this.musicToggle.setAttribute('aria-pressed', String(enabled));
      this.musicToggle.textContent = `MÚSICA: ${enabled ? 'LIGADA' : 'DESLIGADA'}`;
    }

    if (enabled) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    this.updateAudioPlayback();
  }

  updateAudioPlayback() {
    if (this.soundEnabled || this.musicEnabled) {
      this.getAudioContext();
    } else if (this.audioContext?.state === 'running') {
      this.audioContext.suspend().catch((error) => {
        console.error('Não foi possível pausar o áudio do jogo.', error);
      });
    }
  }

  startBackgroundMusic() {
    if (!this.musicEnabled || this.backgroundMusicSource) {
      return;
    }

    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    this.backgroundMusicBuffer ||= this.createBackgroundMusicBuffer(audioContext);
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    source.buffer = this.backgroundMusicBuffer;
    source.loop = true;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(2.4, audioContext.currentTime + 1.5);
    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start();
    this.backgroundMusicSource = source;
    this.backgroundMusicGain = gain;
  }

  stopBackgroundMusic() {
    if (!this.backgroundMusicSource) {
      return;
    }

    this.backgroundMusicSource.stop();
    this.backgroundMusicSource.disconnect();
    this.backgroundMusicGain?.disconnect();
    this.backgroundMusicSource = null;
    this.backgroundMusicGain = null;
  }

  createBackgroundMusicBuffer(audioContext) {
    const chords = [
      [130.81, 164.81, 196, 246.94],
      [110, 130.81, 164.81, 196],
      [87.31, 110, 130.81, 164.81],
      [98, 123.47, 146.83, 196],
    ];
    const melody = [659.25, 523.25, 587.33, 392, 440, 523.25, 493.88, 392];
    const chordDuration = 4;
    const loopDuration = chordDuration * chords.length;
    const sampleRate = audioContext.sampleRate;
    const frameCount = Math.floor(sampleRate * loopDuration);
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const samples = buffer.getChannelData(0);
    const loopedChords = chords.map((chord) => chord.map(
      (frequency) => Math.round(frequency * loopDuration) / loopDuration,
    ));
    const loopedMelody = melody.map(
      (frequency) => Math.round(frequency * loopDuration) / loopDuration,
    );

    for (let frame = 0; frame < frameCount; frame += 1) {
      const time = frame / sampleRate;
      const chordIndex = Math.floor(time / chordDuration);
      const nextChordIndex = (chordIndex + 1) % chords.length;
      const chordTime = time % chordDuration;
      const transition = Math.max(0, Math.min(1, (chordTime - 2.8) / 1.2));
      let sample = 0;

      for (let voice = 0; voice < loopedChords[chordIndex].length; voice += 1) {
        const currentPhase = 2 * Math.PI * loopedChords[chordIndex][voice] * time;
        const nextPhase = 2 * Math.PI * loopedChords[nextChordIndex][voice] * time;
        sample += (Math.sin(currentPhase) * (1 - transition) +
          Math.sin(nextPhase) * transition) * 0.022;
      }

      const melodyTime = time % 2;
      const melodyIndex = Math.floor(time / 2);
      const melodyPhase = 2 * Math.PI * loopedMelody[melodyIndex] * melodyTime;
      const melodyEnvelope = Math.min(1, melodyTime / 0.03) * Math.exp(-melodyTime * 3);
      sample += (Math.sin(melodyPhase) + Math.sin(melodyPhase * 2) * 0.18) *
        melodyEnvelope * 0.025;
      samples[frame] = sample;
    }

    return buffer;
  }

  getAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      if (!this.audioUnavailable) {
        console.error('Este navegador não oferece suporte ao áudio do jogo.');
        this.audioUnavailable = true;
      }
      return null;
    }

    this.audioContext ||= new AudioContextConstructor();
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch((error) => {
        console.error('Não foi possível iniciar o áudio do jogo.', error);
      });
    }
    return this.audioContext;
  }

  playSound(frequency, duration, delay = 0) {
    if (!this.soundEnabled) {
      return;
    }

    const audioContext = this.getAudioContext();
    if (!audioContext) {
      return;
    }

    const startsAt = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, startsAt);
    volume.gain.setValueAtTime(0.0001, startsAt);
    volume.gain.exponentialRampToValueAtTime(0.08, startsAt + 0.01);
    volume.gain.exponentialRampToValueAtTime(0.001, startsAt + duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(startsAt);
    oscillator.stop(startsAt + duration);
  }

  render(context) {
    if (this.tutorialHints) {
      this.tutorialHints.hidden = !this.tutorialEnabled || Boolean(this.questionScreen);
    }

    if (this.questionScreen && this.questionBackgroundImage.complete &&
      this.questionBackgroundImage.naturalWidth > 0) {
      context.save();
      context.imageSmoothingEnabled = false;
      context.drawImage(
        this.questionBackgroundImage,
        0,
        0,
        this.game.canvas.width,
        this.game.canvas.height,
      );
      context.restore();
    } else {
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
    }

    if (!this.questionScreen) {
      context.fillStyle = '#ffffff';
      context.font = 'bold 18px monospace';
      context.textAlign = 'left';
      context.fillText(`PONTOS: ${this.score}`, 18, 30);
      if (this.cofImage.complete && this.cofImage.naturalWidth > 0) {
        const bounds = this.getShopIconBounds();
        context.save();
        context.imageSmoothingEnabled = false;
        context.drawImage(this.cofImage, bounds.x, bounds.y, bounds.width, bounds.height);
        context.restore();
      }
      if (this.blackHoleDistance < this.blackHole.pullRadius && !this.gameOver) {
        context.fillStyle = '#ffd47a';
        context.textAlign = 'center';
        context.fillText('ATRACAO DO BURACO NEGRO!', this.game.canvas.width / 2, 78);
      }
    }

    if (this.gameOver) {
      this.renderGameOver(context);
    }

    if (this.questionScreen) {
      this.renderQuestionScreen(context);
    }
  }

  renderGameOver(context) {
    const panelWidth = 380;
    const panelHeight = 250;
    const panelX = (this.game.canvas.width - panelWidth) / 2;
    const panelY = (this.game.canvas.height - panelHeight) / 2;

    context.save();
    context.fillStyle = '#12366d';
    context.fillRect(panelX, panelY, panelWidth, panelHeight);
    context.fillStyle = 'rgba(190, 239, 250, 0.96)';
    context.fillRect(panelX + 3, panelY + 3, panelWidth - 6, panelHeight - 6);
    context.fillStyle = '#258f32';
    context.fillRect(panelX + 3, panelY + 3, panelWidth - 6, 8);

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#12366d';
    context.font = "16px 'Press Start 2P', monospace";
    context.fillText('VOCE PERDEU!', this.game.canvas.width / 2, panelY + 46);
    context.font = '14px monospace';
    context.fillText(
      this.blackHoleCaptured ? 'O buraco negro te puxou!' : 'Nao desista, tente de novo!',
      this.game.canvas.width / 2,
      panelY + 82,
    );
    context.font = 'bold 17px monospace';
    context.fillText(`PONTOS: ${this.score}`, this.game.canvas.width / 2, panelY + 115);

    const buttonWidth = 260;
    const buttonHeight = 38;
    const buttonX = (this.game.canvas.width - buttonWidth) / 2;
    const buttonY = panelY + 155;
    context.beginPath();
    context.moveTo(buttonX + 10, buttonY);
    context.arcTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + buttonHeight, 10);
    context.arcTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX, buttonY + buttonHeight, 10);
    context.arcTo(buttonX, buttonY + buttonHeight, buttonX, buttonY, 10);
    context.arcTo(buttonX, buttonY, buttonX + buttonWidth, buttonY, 10);
    context.closePath();
    context.fillStyle = '#258f32';
    context.fill();
    context.fillStyle = '#ffffff';
    context.font = "9px 'Press Start 2P', monospace";
    context.fillText(
      'RECOMECAR / ENTER',
      this.game.canvas.width / 2,
      buttonY + buttonHeight / 2,
    );
    context.restore();
  }

  reset() {
    this.score = 0;
    this.gameOver = false;
    this.questionScreen = null;
    this.answerInput = '';
    this.questionResult = null;
    this.blackHoleCaptured = false;
    this.blackHoleDistance = Infinity;
    this.elapsedTime = 0;
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
      block.question = getQuestion(block.questionIndex + this.questionRotation);
      block.used = false;
      block.questionAsked = false;
    }
  }

  createQuestionBlock(x, y, questionIndex) {
    const block = new QuestionBlock(
      x,
      y,
      getQuestion(questionIndex + this.questionRotation),
      this.starImage,
    );
    block.questionIndex = questionIndex;
    return block;
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
      this.playSound(660, 0.15);
      this.playSound(880, 0.18, 0.12);
    } else {
      this.questionResult = 'Resposta incorreta. Tente o proximo bloco!';
      this.playSound(220, 0.22);
    }
    if (this.answerField) {
      this.answerField.disabled = true;
      this.answerField.hidden = true;
    }
  }

  getQuestionPanelBounds() {
    const panelWidth = Math.min(500, this.game.canvas.width - 32);
    const panelHeight = 350;
    const panelX = (this.game.canvas.width - panelWidth) / 2;
    const panelY = (this.game.canvas.height - panelHeight) / 2;
    return { panelWidth, panelHeight, panelX, panelY };
  }

  getQuestionButtonBounds() {
    const { panelWidth, panelX, panelY } = this.getQuestionPanelBounds();
    const width = 108;
    const height = 34;
    return {
      x: panelX + (panelWidth - width) / 2,
      y: panelY + 262,
      width,
      height,
    };
  }

  getShopIconBounds() {
    const iconSize = 44;
    return {
      x: this.game.canvas.width - iconSize - 16,
      y: 10,
      width: iconSize,
      height: iconSize,
    };
  }

  getHydrantBounds() {
    const imageWidth = this.questionBackgroundImage.naturalWidth || 1920;
    const imageHeight = this.questionBackgroundImage.naturalHeight || 1080;
    const scaleX = this.game.canvas.width / imageWidth;
    const scaleY = this.game.canvas.height / imageHeight;
    return {
      x: 68 * scaleX,
      y: 730 * scaleY,
      width: 100 * scaleX,
      height: 215 * scaleY,
    };
  }

  renderQuestionScreen(context) {
    const questionLines = this.questionScreen.question.text.split('\n');
    const questionContext = questionLines[0];
    const codeLines = questionLines.slice(2, -2);
    const { panelWidth, panelHeight, panelX, panelY } = this.getQuestionPanelBounds();
    const isResult = Boolean(this.questionResult);

    context.fillStyle = '#0b5eae';
    context.fillRect(panelX + 8, panelY, panelWidth - 16, panelHeight);
    context.fillRect(panelX, panelY + 8, panelWidth, panelHeight - 16);
    context.fillStyle = '#f5fbff';
    context.fillRect(panelX + 12, panelY + 6, panelWidth - 24, panelHeight - 12);
    context.fillRect(panelX + 6, panelY + 12, panelWidth - 12, panelHeight - 24);
    context.fillStyle = '#122d73';
    context.textAlign = 'left';
    context.font = 'bold 12px monospace';
    const contextLines = [];
    let contextLine = '';
    for (const word of questionContext.split(' ')) {
      const candidate = contextLine ? `${contextLine} ${word}` : word;
      if (contextLine && context.measureText(candidate).width > panelWidth - 44) {
        contextLines.push(contextLine);
        contextLine = word;
      } else {
        contextLine = candidate;
      }
    }
    if (contextLine) {
      contextLines.push(contextLine);
    }
    contextLines.forEach((line, index) => {
      context.fillText(line, panelX + 22, panelY + 28 + index * 12, panelWidth - 44);
    });

    context.fillStyle = '#173b70';
    context.beginPath();
    context.roundRect(panelX + 24, panelY + 48, panelWidth - 48, 88, 8);
    context.fill();
    context.strokeStyle = '#1675d1';
    context.lineWidth = 1.5;
    context.stroke();
    context.font = 'bold 12px monospace';
    codeLines.forEach((line, index) => {
      const lineY = panelY + 60 + index * 14;
      context.fillStyle = '#b9cbea';
      context.fillText(`${index + 1} |`, panelX + 48, lineY);
      context.fillStyle = '#ffffff';
      context.fillText(line, panelX + 92, lineY, panelWidth - 124);
    });

    context.fillStyle = '#ffffff';
    context.beginPath();
    context.roundRect(panelX + 18, panelY + 147, panelWidth - 36, 32, 6);
    context.fill();
    context.strokeStyle = '#3578d4';
    context.lineWidth = 1.5;
    context.stroke();
    if (isResult) {
      context.fillStyle = '#173b70';
      context.textAlign = 'left';
      context.font = '12px monospace';
      context.fillText(`Sua resposta: ${this.answerInput}`, panelX + 28, panelY + 168);
    }

    context.fillStyle = '#122d73';
    context.textAlign = 'left';
    context.font = 'bold 10px monospace';
    context.fillText(
      isResult ? 'RESOLUCAO:' : 'CONTEUDO:',
      panelX + 28,
      panelY + (isResult ? 196 : 206),
    );
    context.fillStyle = '#173b70';
    context.font = '12px monospace';
    const explanation = isResult
      ? this.questionScreen.question.explanation
      : this.questionScreen.question.codeExplanation;
    const explanationLines = [];
    let explanationLine = '';
    for (const word of explanation.split(' ')) {
      const candidate = explanationLine ? `${explanationLine} ${word}` : word;
      if (explanationLine && context.measureText(candidate).width > panelWidth - 56) {
        explanationLines.push(explanationLine);
        explanationLine = word;
      } else {
        explanationLine = candidate;
      }
    }
    if (explanationLine) {
      explanationLines.push(explanationLine);
    }
    explanationLines.slice(0, 5).forEach((line, index) => {
      const explanationTop = isResult ? 212 : 224;
      context.fillText(line, panelX + 28, panelY + explanationTop + index * 13, panelWidth - 56);
    });

    const button = this.getQuestionButtonBounds();
    if (this.sendButtonImage.complete && this.sendButtonImage.naturalWidth > 0) {
      context.drawImage(this.sendButtonImage, button.x, button.y, button.width, button.height);
      if (this.questionResult) {
        context.fillStyle = '#74a050';
        context.fillRect(
          button.x + button.width * 0.1,
          button.y + button.height * 0.28,
          button.width * 0.8,
          button.height * 0.44,
        );
        context.fillStyle = '#ffffff';
        context.font = '8px "Press Start 2P", monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(
          'VOLTAR',
          button.x + button.width / 2,
          button.y + button.height / 2,
          button.width * 0.72,
        );
        context.textBaseline = 'alphabetic';
      }
    } else {
      context.fillStyle = '#2478ed';
      context.fillRect(button.x, button.y, button.width, button.height);
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.font = 'bold 16px monospace';
      context.fillText(
        this.questionResult ? 'VOLTAR' : 'ENVIAR',
        button.x + button.width / 2,
        button.y + button.height / 2 + 6,
      );
    }

    if (this.questionResult) {
      const isCorrect = this.questionResult.startsWith('Correto');
      context.textAlign = 'center';
      context.font = '9px "Press Start 2P", monospace';
      context.fillStyle = isCorrect ? '#147a36' : '#a32626';
      context.fillText(
        isCorrect ? 'CORRETO! +100 PONTOS' : 'RESPOSTA INCORRETA',
        this.game.canvas.width / 2,
        panelY + 310,
        panelWidth - 48,
      );

      context.fillStyle = '#5576ac';
      context.font = '8px "Press Start 2P", monospace';
      context.fillText(
        'CLIQUE PARA VOLTAR OU PRESSIONE ENTER',
        this.game.canvas.width / 2,
        panelY + 324,
        panelWidth - 48,
      );
    }
  }

  renderSky(context) {
    const altitude = Math.max(0, -this.cameraY);
    const stages = [
      { altitude: 0, top: [104, 209, 244], bottom: [190, 239, 250] },
      { altitude: 1400, top: [74, 132, 205], bottom: [144, 190, 231] },
      { altitude: 2600, top: [12, 23, 69], bottom: [37, 48, 94] },
      { altitude: 4200, top: [27, 12, 67], bottom: [65, 28, 98] },
      { altitude: 5600, top: [4, 5, 17], bottom: [12, 13, 31] },
    ];
    let stageIndex = 1;
    while (stageIndex < stages.length && altitude > stages[stageIndex].altitude) {
      stageIndex += 1;
    }
    const from = stages[stageIndex - 1];
    const to = stages[Math.min(stageIndex, stages.length - 1)];
    const transition = to.altitude === from.altitude
      ? 1
      : Math.max(0, Math.min(1, (altitude - from.altitude) / (to.altitude - from.altitude)));
    const topColor = this.blendColors(from.top, to.top, transition);
    const bottomColor = this.blendColors(from.bottom, to.bottom, transition);
    const gradient = context.createLinearGradient(0, 0, 0, this.game.canvas.height);
    gradient.addColorStop(0, `rgb(${topColor.join(',')})`);
    gradient.addColorStop(1, `rgb(${bottomColor.join(',')})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    const nebulaFadeIn = Math.max(0, Math.min(1, (altitude - 2500) / 1200));
    const nebulaFadeOut = Math.max(0, Math.min(1, (5700 - altitude) / 1500));
    const nebulaOpacity = nebulaFadeIn * nebulaFadeOut;
    if (nebulaOpacity > 0) {
      const nebula = context.createRadialGradient(
        this.game.canvas.width * 0.28,
        this.game.canvas.height * 0.38,
        10,
        this.game.canvas.width * 0.28,
        this.game.canvas.height * 0.38,
        this.game.canvas.width * 0.72,
      );
      nebula.addColorStop(0, `rgba(183, 73, 198, ${nebulaOpacity * 0.2})`);
      nebula.addColorStop(1, 'rgba(183, 73, 198, 0)');
      context.fillStyle = nebula;
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }

    const starVisibility = Math.max(0, Math.min(1, (altitude - 850) / 1200));
    if (starVisibility > 0) {
      const scroll = (altitude * 0.12) % this.game.canvas.height;
      for (let index = 0; index < 100; index += 1) {
        const x = (index * 149 + 37) % this.game.canvas.width;
        const y = (index * 97 + 53 + scroll) % this.game.canvas.height;
        const size = index % 9 === 0 ? 3 : 2;
        const opacity = starVisibility * (0.5 + (index % 4) * 0.14);
        context.fillStyle = `rgba(245, 250, 255, ${opacity})`;
        context.fillRect(x, y, size, size);
      }
    }

  }

  renderScenery(context) {
    const progress = this.getAscentProgress();

    const moonVisibility = Math.max(0, Math.min(1, (progress - 0.58) / 0.3));
    if (moonVisibility > 0) {
      const moonX = this.worldWidth / 2;
      const moonY = -1510;
      const moonRadius = 68;
      context.save();
      context.globalAlpha = moonVisibility;
      const glow = context.createRadialGradient(moonX, moonY, moonRadius * 0.65, moonX, moonY, moonRadius * 1.8);
      glow.addColorStop(0, 'rgba(220, 241, 255, 0.38)');
      glow.addColorStop(1, 'rgba(220, 241, 255, 0)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(moonX, moonY, moonRadius * 1.8, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = '#e5edf0';
      context.beginPath();
      context.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#c5d3dc';
      context.beginPath();
      context.arc(moonX - 22, moonY - 16, 12, 0, Math.PI * 2);
      context.arc(moonX + 26, moonY + 18, 17, 0, Math.PI * 2);
      context.arc(moonX - 6, moonY + 38, 7, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    this.renderBlackHole(context);

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

  getAscentProgress() {
    return Math.max(0, Math.min(1, -this.cameraY / Math.abs(this.worldTop)));
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
    const clampedCameraY = Math.min(0, targetCameraY);

    this.cameraY += (clampedCameraY - this.cameraY) * 0.12;
  }

  generatePlatformsAhead() {
    const generationBoundary = this.player.y - this.game.canvas.height;

    while (this.nextPlatformY > generationBoundary) {
      const x = this.generatedPlatformXs[
        this.generatedPlatformIndex % this.generatedPlatformXs.length
      ];
      const platform = new Platform(x, this.nextPlatformY, 130, 34, this.platformImage);
      this.platforms.push(platform);
      this.addPlatformItems(platform, this.generatedPlatformIndex);
      this.nextPlatformY -= 110;
      this.generatedPlatformIndex += 1;
    }
  }

  addPlatformItems(platform, index) {
    const itemType = index % 6;

    if (itemType === 1) {
      const coinX = platform.x + (platform.width - 22) / 2;
      this.coins.push(new Coin(coinX, platform.y - 32, this.coinImage));
    } else if (itemType === 3) {
      const questionIndex = 4 + Math.floor(index / 6);
      this.questionBlocks.push(this.createQuestionBlock(
        platform.x + 48,
        platform.y - 39,
        questionIndex,
      ));
    } else if (itemType === 5) {
      this.plants.push(new Plant(
        platform.x + (platform.width - 28) / 2,
        platform.y - 43,
        this.plantImage,
      ));
    }
  }

  updateBlackHole(deltaTime) {
    const playerCenterX = this.player.x + this.player.width / 2;
    const playerCenterY = this.player.y + this.player.height / 2;
    const offsetX = this.blackHole.x - playerCenterX;
    const offsetY = this.blackHole.y - playerCenterY;
    const distance = Math.hypot(offsetX, offsetY);
    this.blackHoleDistance = distance;

    if (distance >= this.blackHole.pullRadius) {
      return;
    }

    if (distance <= this.blackHole.eventHorizon) {
      if (this.player.velocityY < 0) {
        return;
      }

      this.blackHoleCaptured = true;
      this.gameOver = true;
      this.playSound(130, 0.4);
      this.game.input.clear();
      return;
    }

    const directionX = offsetX / distance;
    const directionY = offsetY / distance;
    const pullFactor = 1 - distance / this.blackHole.pullRadius;
    const strength = 1500 * pullFactor * pullFactor;
    const horizontalPullSpeed = Math.min(110, strength * 0.18);
    this.player.x += directionX * horizontalPullSpeed * deltaTime;
    this.player.velocityY += directionY * strength * deltaTime;
  }

  renderBlackHole(context) {
    const { x, y } = this.blackHole;
    context.save();
    context.translate(x, y);

    const glow = context.createRadialGradient(0, 0, 24, 0, 0, 190);
    glow.addColorStop(0, 'rgba(255, 112, 42, 0.24)');
    glow.addColorStop(0.38, 'rgba(239, 76, 40, 0.16)');
    glow.addColorStop(0.7, 'rgba(80, 118, 255, 0.1)');
    glow.addColorStop(1, 'rgba(22, 36, 105, 0)');
    context.fillStyle = glow;
    context.beginPath();
    context.arc(0, 0, 205, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.rotate(-0.08);
    const disk = context.createLinearGradient(-172, -10, 172, 18);
    disk.addColorStop(0, '#6b202b');
    disk.addColorStop(0.2, '#ef4b25');
    disk.addColorStop(0.39, '#ff9b37');
    disk.addColorStop(0.49, '#fff1bd');
    disk.addColorStop(0.56, '#ffc15d');
    disk.addColorStop(0.76, '#e74425');
    disk.addColorStop(1, '#67243c');
    context.shadowColor = '#ff7135';
    context.shadowBlur = 24;
    context.fillStyle = disk;
    context.beginPath();
    context.ellipse(0, 0, 170, 33, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.shadowBlur = 0;
    const shadow = context.createRadialGradient(-10, -12, 4, 0, 0, 52);
    shadow.addColorStop(0, '#000000');
    shadow.addColorStop(0.78, '#02030a');
    shadow.addColorStop(1, '#11182b');
    context.fillStyle = shadow;
    context.beginPath();
    context.arc(0, 0, 47, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'rgba(255, 220, 151, 0.9)';
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(0, 0, 51, 17, -0.08, Math.PI * 1.08, Math.PI * 1.92);
    context.stroke();

    context.strokeStyle = 'rgba(255, 111, 52, 0.9)';
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, 1, 83, 20, -0.08, 0.12, Math.PI - 0.12);
    context.stroke();
    context.restore();
  }
}