import { Entity } from './Entity.js';

export class Plant extends Entity {
  constructor(x, y, texture = null) {
    super(x, y, 28, 43, '#2d9b45');
    this.texture = texture;
    this.transparentTexture = null;
  }

  render(context) {
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      const texture = this.getTransparentTexture();
      context.drawImage(texture, this.x, this.y, this.width, this.height);
      return;
    }

    context.fillStyle = this.color;
    context.fillRect(this.x + 18, this.y, 6, this.height);
    context.fillRect(this.x, this.y + 20, 22, 8);
    context.fillRect(this.x + 20, this.y + 38, 22, 8);
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