class Platform {
  constructor({ x, y, size = 40, fixed = false }) {
    this.position = { x, y }; // y는 바닥 높이
    this.baseSize = size;
    this.currentSize = size;
    this.fixed = fixed;
  }

  draw(ctx, player = null) {
    const prevSize = this.currentSize;
    this.currentSize += (this.baseSize * scaleMode - this.currentSize) * 0.2;
    const s = this.currentSize;

    const drawX = this.position.x - s / 2;
    const drawY = this.position.y - s;

    ctx.fillStyle = this.fixed ? '#666' : 'blue';
    ctx.fillRect(drawX, drawY, s, s);

    this.hitbox = { x: drawX, y: drawY, size: s };

    // ✅ 플레이어 겹침 시 밀어내기
    if (player) {
      const p = player;
      if (
        p.position.x + p.width > drawX &&
        p.position.x < drawX + s &&
        p.position.y + p.height > drawY &&
        p.position.y < drawY + s
      ) {
        // 겹침 방향 계산
        const overlapX1 = p.position.x + p.width - drawX;     // 왼쪽 겹침
        const overlapX2 = drawX + s - p.position.x;           // 오른쪽 겹침
        const overlapY1 = p.position.y + p.height - drawY;    // 위쪽 겹침
        const overlapY2 = drawY + s - p.position.y;           // 아래쪽 겹침

        const minOverlap = Math.min(overlapX1, overlapX2, overlapY1, overlapY2);

        if (minOverlap === overlapX1) p.position.x -= overlapX1; // 왼쪽 밀기
        else if (minOverlap === overlapX2) p.position.x += overlapX2; // 오른쪽 밀기
        else if (minOverlap === overlapY1) p.position.y -= overlapY1; // 위로 밀기
        else if (minOverlap === overlapY2) p.position.y += overlapY2; // 아래로 밀기
      }
    }
  }
}
