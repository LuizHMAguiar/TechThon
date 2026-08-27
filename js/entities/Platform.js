import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(x, y, width, height = 18, texture = null) {
    super(x, y, width, height, '#8b451f');
    this.texture = texture;
  }

  render(context) {
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      const tileHeight = this.height;
      const tileWidth = tileHeight * this.texture.naturalWidth / this.texture.naturalHeight;

      context.save();
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      context.clip();

      for (let tileX = this.x; tileX < this.x + this.width; tileX += tileWidth) {
        context.drawImage(this.texture, tileX, this.y, tileWidth, tileHeight);
      }

      context.restore();
      return;
    }

    context.fillStyle = '#8b451f';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = '#62d13f';
    context.fillRect(this.x, this.y, this.width, 7);
    context.fillStyle = '#258f32';
    context.fillRect(this.x, this.y + 7, this.width, 3);
  }
}