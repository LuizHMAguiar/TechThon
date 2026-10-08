import { Entity } from './Entity.js';

export class QuestionBlock extends Entity {
  constructor(x, y, question, texture = null) {
    super(x, y, 34, 34, '#f6bd24');
    this.question = question;
    this.texture = texture;
    this.transparentTexture = null;
    this.used = false;
    this.questionAsked = false;
  }

  render(context) {
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      const texture = this.getTransparentTexture();
      const margin = 4;
      const size = this.width - margin * 2;
      context.drawImage(texture, this.x + margin, this.y + margin, size, size);
      return;
    }

    context.fillStyle = this.used ? '#a66b1f' : '#ffd43b';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeStyle = '#9a5b13';
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);

    if (!this.used) {
      context.fillStyle = '#fff3b0';
      context.font = 'bold 18px monospace';
      context.textAlign = 'center';
      context.fillText('?', this.x + this.width / 2, this.y + this.height / 2 + 7);
    }
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
      const isBackground = imageData.data[index] > 245 &&
        imageData.data[index + 1] > 245 &&
        imageData.data[index + 2] > 245;

      if (isBackground) {
        imageData.data[index + 3] = 0;
      }
    }

    textureContext.putImageData(imageData, 0, 0);
    this.transparentTexture = canvas;
    return canvas;
  }
}