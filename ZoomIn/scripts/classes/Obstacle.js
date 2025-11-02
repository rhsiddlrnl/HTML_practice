class Obstacle {
  constructor({ x, y, size = 40 }) {
    this.position = { x, y }; // y는 바닥 높이
    this.baseSize = size;
    this.currentSize = size;
  }

  draw(ctx) {
    // 부드러운 확대/축소
    this.currentSize += (this.baseSize * scaleMode - this.currentSize) * 0.2;
    const s = this.currentSize;

    // center-bottom 피봇
    const drawX = this.position.x - s / 2;
    const drawY = this.position.y - s; // 바닥 기준

    ctx.fillStyle = 'red';
    ctx.fillRect(drawX, drawY, s, s);

    // 실제 충돌용 히트박스
    this.hitbox = { x: drawX, y: drawY, size: s };
  }
}
