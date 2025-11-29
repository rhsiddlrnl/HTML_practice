class Goal {
  constructor({x, y, size = 50}, image = null) {
    this.position = { x, y };
    this.size = size;
    this.image = image;
  }

  draw(ctx) {
    const s = this.size;
    const drawX = this.position.x - s / 2;
    const drawY = this.position.y - s;

    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, drawX, drawY, s, s);
    } else {
      ctx.fillStyle = 'gold';
      ctx.fillRect(drawX, drawY, s, s);
    }
  }
}
