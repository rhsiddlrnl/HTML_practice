class Platform {
  constructor({ x, y, size = 100, fixed = false }) {
    this.position = { x, y }; // y는 바닥 높이
    this.baseSize = size;
    this.currentSize = size;
    this.fixed = fixed;
  }

  draw(ctx) {
    this.currentSize += (this.baseSize * scaleMode - this.currentSize) * 0.2;
    const s = this.currentSize;

    // center-bottom 피봇
    const drawX = this.position.x - s / 2;
    const drawY = this.position.y - s;

    ctx.fillStyle = this.fixed ? '#666' : 'blue';
    ctx.fillRect(drawX, drawY, s, s);

    this.hitbox = { x: drawX, y: drawY, size: s };
  }
}
