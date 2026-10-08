import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(x, y, width, height = 18, texture = null, drawTextureDirectly = false) {
    super(x, y, width, height, '#8b451f');
    this.texture = texture;
    this.drawTextureDirectly = drawTextureDirectly;
  }

  render(context) {
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      if (this.drawTextureDirectly) {
        const texture = this.getTextureWithoutWhite();
        const textureHeight = this.width * this.texture.naturalHeight / this.texture.naturalWidth;
        context.fillStyle = '#8f321c';
        context.fillRect(this.x, this.y, this.width, textureHeight);
        context.drawImage(texture, this.x, this.y, this.width, textureHeight);
        return;
      }

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

  getTextureWithoutWhite() {
    if (this.cleanedTexture) {
      return this.cleanedTexture;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.texture.naturalWidth;
    canvas.height = this.texture.naturalHeight;
    const textureContext = canvas.getContext('2d');
    textureContext.drawImage(this.texture, 0, 0);

    const imageData = textureContext.getImageData(0, 0, canvas.width, canvas.height);
    for (let pixel = 0; pixel < imageData.data.length; pixel += 4) {
      if (imageData.data[pixel] > 245 &&
          imageData.data[pixel + 1] > 245 &&
          imageData.data[pixel + 2] > 245) {
        imageData.data[pixel + 3] = 0;
      }
    }

    textureContext.putImageData(imageData, 0, 0);
    this.cleanedTexture = canvas;
    return canvas;
  }
}