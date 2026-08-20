import { Entity } from './Entity.js';

export class QuestionBlock extends Entity {
  constructor(x, y) {
    super(x, y, 34, 34, '#f6bd24');
    this.used = false;
    this.questionAsked = false;
  }

  render(context) {
    context.fillStyle = this.used ? '#a66b1f' : this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.strokeStyle = '#7c4a16';
    context.lineWidth = 3;
    context.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

    if (!this.used) {
      context.fillStyle = '#fff3b0';
      context.font = 'bold 25px monospace';
      context.textAlign = 'center';
      context.fillText('?', this.x + this.width / 2, this.y + 26);
    }
  }
}