import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(x, y, texture = null) {
    super(x, y, 28, 34, '#ffd166');
    this.texture = texture;
    this.speed = 220;
    this.jumpStrength = 560;
    this.gravity = 1200;
    this.velocityY = 0;
    this.grounded = false;
    this.jumpsRemaining = 1;
    this.jumpHeld = false;
    this.walkTime = 0;
    this.walkDirection = 0;
  }

  update(deltaTime, input, canvas, platforms, worldWidth = canvas.width) {
    const previousY = this.y;
    const jumpHeld = input.isDown('arrowup') || input.isDown('w') || input.isDown(' ');
    const jumpPressed = jumpHeld && !this.jumpHeld;
    this.jumpHeld = jumpHeld;
    const horizontalDirection = Number(input.isDown('arrowright') || input.isDown('d'))
      - Number(input.isDown('arrowleft') || input.isDown('a'));
    this.walkDirection = horizontalDirection;
    if (horizontalDirection !== 0 && this.grounded) {
      this.walkTime += deltaTime * 10;
    }

    this.x += horizontalDirection * this.speed * deltaTime;

    if (jumpPressed && this.jumpsRemaining > 0) {
      this.velocityY = -this.jumpStrength;
      this.grounded = false;
      this.jumpsRemaining -= 1;
    }

    this.velocityY += this.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    this.grounded = false;

    for (const platform of platforms) {
      const wasAbovePlatform = previousY + this.height <= platform.y;
      const isCrossingPlatform = this.y + this.height >= platform.y;
      const overlapsPlatform = this.x < platform.x + platform.width &&
        this.x + this.width > platform.x;

      if (this.velocityY >= 0 && wasAbovePlatform && isCrossingPlatform && overlapsPlatform) {
        this.y = platform.y - this.height;
        this.velocityY = 0;
        this.grounded = true;
        this.jumpsRemaining = 1;
      }
    }

    this.x = Math.max(0, Math.min(worldWidth - this.width, this.x));

    if (this.y > canvas.height + this.height) {
      this.x = 80;
      this.y = 300;
      this.velocityY = 0;
      this.grounded = false;
      this.jumpsRemaining = 1;
    }
  }

  render(context) {
    if (this.texture?.complete && this.texture.naturalWidth > 0) {
      const displayHeight = this.height * 1.45;
      const textureWidth = displayHeight * this.texture.naturalWidth / this.texture.naturalHeight;
      const walkOffset = this.walkDirection !== 0 && this.grounded
        ? Math.sin(this.walkTime) * 2
        : 0;
      const walkAngle = this.walkDirection !== 0 && this.grounded
        ? Math.sin(this.walkTime) * 0.08
        : 0;
      const drawX = this.x + this.width / 2 + walkOffset;
      const drawY = this.y + this.height;

      context.save();
      context.translate(drawX, drawY);
      context.rotate(walkAngle);
      context.drawImage(
        this.texture,
        -textureWidth / 2,
        -displayHeight,
        textureWidth,
        displayHeight,
      );
      context.restore();
      return;
    }

    context.fillStyle = '#1d1b2e';
    context.fillRect(this.x + 5, this.y + 4, 18, 27);
    context.fillStyle = '#8b451f';
    context.fillRect(this.x + 7, this.y + 9, 14, 11);
    context.fillStyle = '#e63946';
    context.fillRect(this.x + 3, this.y + 3, 22, 5);
    context.fillRect(this.x + 8, this.y, 13, 4);
    context.fillStyle = '#f4a261';
    context.fillRect(this.x + 5, this.y + 20, 7, 11);
    context.fillRect(this.x + 16, this.y + 20, 7, 11);
    context.fillStyle = '#ffd166';
    context.fillRect(this.x + 7, this.y + 31, 6, 3);
    context.fillRect(this.x + 17, this.y + 31, 6, 3);
  }
}