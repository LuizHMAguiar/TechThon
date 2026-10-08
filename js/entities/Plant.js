import { Entity } from './Entity.js';

export class Plant extends Entity {
  constructor(x, y, texture = null) {
    super(x, y, 28, 43, '#2d9b45');
    this.texture = texture;
    this.transparentTexture = null;
    this.time = 0;
  }

  update(deltaTime) {
    this.time += deltaTime;
  }

  render(context) {
    const bite = Math.max(0, Math.sin(this.time * Math.PI * 2 / 1.2)) ** 8;
    context.save();
    context.translate(this.x + this.width / 2, this.y + this.height);
    context.rotate(-0.16 * bite);
    context.scale(1 - 0.2 * bite, 1 + 0.08 * bite);

    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      const texture = this.getTransparentTexture();
      context.drawImage(texture, -this.width / 2, -this.height, this.width, this.height);
      context.restore();
      return;
    }

    context.fillStyle = this.color;
    context.fillRect(18 - this.width / 2, -this.height, 6, this.height);
    context.fillRect(-this.width / 2, -this.height + 20, 22, 8);
    context.fillRect(20 - this.width / 2, -this.height + 38, 22, 8);
    context.restore();
  }

  getTransparentTexture() {
    if (this.transparentTexture) {
      return this.transparentTexture;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.texture.naturalWidth;
    canvas.height = this.texture.naturalHeight;
    const textureContext = canvas.getContext('2d');
    textureContext.drawImage(this.texture, 0, 0);

    const imageData = textureContext.getImageData(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < imageData.data.length; index += 4) {
      const isBackground = imageData.data[index] > 235 &&
        imageData.data[index + 1] > 235 &&
        imageData.data[index + 2] > 235;

      if (isBackground) {
        imageData.data[index + 3] = 0;
      }
    }

    textureContext.putImageData(imageData, 0, 0);
    this.transparentTexture = canvas;
    return canvas;
  }
}