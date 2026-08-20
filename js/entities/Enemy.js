import { Entity } from './Entity.js';

export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 32, 32, '#e63946');
    this.direction = 1;
    this.speed = 90;
  }

  update(deltaTime) {
    this.y += this.direction * this.speed * deltaTime;

    if (this.y <= 0 || this.y >= 418) {
      this.direction *= -1;
    }
  }
}