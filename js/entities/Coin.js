import { Entity } from './Entity.js';

export class Coin extends Entity {
  constructor(x, y, texture = null) {
    super(x, y, 22, 28, '#ffd43b');
    this.texture = texture;
    this.baseY = y;
    this.time = 0;
    this.collected = false;
    this.collectTime = 0;
  }

  update(deltaTime) {
    this.time += deltaTime;

    if (this.collected) {
      this.collectTime += deltaTime;
      this.y -= 90 * deltaTime;
    } else {
      this.y = this.baseY + Math.sin(this.time * 4) * 5;
    }
  }

  collect() {
    this.collected = true;
  }

  render(context) {
    if (this.collected && this.collectTime > 0.45) {
      return;
    }

    const opacity = this.collected ? Math.max(0, 1 - this.collectTime / 0.45) : 1;
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      context.save();
      context.globalAlpha = opacity;
      context.drawImage(this.texture, this.x - 4, this.y - 1, 30, 30);
      context.restore();
      return;
    }

    context.save();
    context.globalAlpha = opacity;
    context.fillStyle = '#f59e0b';
    context.beginPath();
    context.ellipse(this.x + this.width / 2, this.y + this.height / 2, 10, 13, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#fff3a3';
    context.fillRect(this.x + 8, this.y + 6, 3, 15);
    context.restore();
  }
}
