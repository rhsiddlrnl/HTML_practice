class Platform {
  constructor({ x, y, size = 40, fixed = false }) {
    this.position = { x, y }; // y는 바닥 기준 좌표
    this.baseSize = size;     // 기본 한 변 크기
    this.currentWidth = size; // 가로 크기
    this.fixed = fixed;
  }

  draw(ctx, player = null) {
    // 좌우로만
    const prevW = this.currentWidth;
    this.currentWidth += (this.baseSize * scaleMode - this.currentWidth) * 0.2;

    const width = this.currentWidth;
    const height = this.baseSize; // 세로 크기는 고정

    // pivot 중앙 아래
    const drawX = this.position.x - width / 2;
    const drawY = this.position.y - height;

    ctx.fillStyle = this.fixed ? '#666' : 'blue';
    ctx.fillRect(drawX, drawY, width, height);

    // 히트박스 (가로세로 분리)
    this.hitbox = { x: drawX, y: drawY, width, height };

    // 플레이어 겹침 시 밀어내기 (좌우/상하 모두)
    if (player) {
      const p = player;
      const overlapX =
        p.position.x + p.width > drawX && p.position.x < drawX + width;
      const overlapY =
        p.position.y + p.height > drawY && p.position.y < drawY + height;

      if (overlapX && overlapY) {
        const overlapX1 = p.position.x + p.width - drawX;     // 왼쪽 겹침
        const overlapX2 = drawX + width - p.position.x;       // 오른쪽 겹침
        const overlapY1 = p.position.y + p.height - drawY;    // 위쪽 겹침
        const overlapY2 = drawY + height - p.position.y;      // 아래쪽 겹침

        const minOverlap = Math.min(overlapX1, overlapX2, overlapY1, overlapY2);

        if (minOverlap === overlapX1) p.position.x -= overlapX1;
        else if (minOverlap === overlapX2) p.position.x += overlapX2;
        else if (minOverlap === overlapY1) p.position.y -= overlapY1;
        else if (minOverlap === overlapY2) p.position.y += overlapY2;
      }
    }
  }
}
