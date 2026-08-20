export class Assets {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
  }

  loadImage(name, source) {
    const image = new Image();
    image.src = source;
    this.images.set(name, image);
    return image;
  }

  getImage(name) {
    return this.images.get(name);
  }
}