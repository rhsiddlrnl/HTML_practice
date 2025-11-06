class Goal {
  constructor({ x, y, size = 50 }) {
    this.position = { x, y };
    this.size = size;
  }

  draw(ctx) {
    const s = this.size;
    const drawX = this.position.x - s / 2;
    const drawY = this.position.y - s;

    ctx.fillStyle = 'gold';
    ctx.fillRect(drawX, drawY, s, s);
  }
}
