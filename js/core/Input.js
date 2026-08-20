export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.pointer = { x: 0, y: 0, pressed: false };

    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault();
        this.keys.add(key);
      }
    });
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key.toLowerCase());
    });
    canvas.addEventListener('pointermove', (event) => this.updatePointer(event, canvas));
    canvas.addEventListener('pointerdown', (event) => {
      this.pointer.pressed = true;
      this.updatePointer(event, canvas);
    });
    window.addEventListener('pointerup', () => {
      this.pointer.pressed = false;
    });
    window.addEventListener('blur', () => this.clear());
  }

  isDown(key) {
    return this.keys.has(key.toLowerCase());
  }

  clear() {
    this.keys.clear();
    this.pointer.pressed = false;
  }

  updatePointer(event, canvas) {
    const bounds = canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
    this.pointer.y = ((event.clientY - bounds.top) / bounds.height) * canvas.height;
  }
}