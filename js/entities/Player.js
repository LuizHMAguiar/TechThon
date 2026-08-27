import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 28, 34, '#ffd166');
    this.speed = 220;
    this.jumpStrength = 560;
    this.gravity = 1200;
    this.velocityY = 0;
    this.grounded = false;
    this.jumpsRemaining = 2;
    this.jumpHeld = false;
  }

  update(deltaTime, input, canvas, platforms, worldWidth = canvas.width) {
    const previousY = this.y;
    const jumpHeld = input.isDown('arrowup') || input.isDown('w') || input.isDown(' ');
    const jumpPressed = jumpHeld && !this.jumpHeld;
    this.jumpHeld = jumpHeld;
    const horizontalDirection = Number(input.isDown('arrowright') || input.isDown('d'))
      - Number(input.isDown('arrowleft') || input.isDown('a'));

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
        this.jumpsRemaining = 2;
      }
    }

    this.x = Math.max(0, Math.min(worldWidth - this.width, this.x));

    if (this.y > canvas.height + this.height) {
      this.x = 80;
      this.y = 300;
      this.velocityY = 0;
      this.grounded = false;
      this.jumpsRemaining = 2;
    }
  }
}