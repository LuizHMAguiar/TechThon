import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(x, y, width, height = 18) {
    super(x, y, width, height, '#8b451f');
  }

  render(context) {
    context.fillStyle = '#8b451f';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = '#55a630';
    context.fillRect(this.x, this.y, this.width, 6);
    context.fillStyle = '#386641';
    context.fillRect(this.x, this.y + 6, this.width, 3);
  }
}