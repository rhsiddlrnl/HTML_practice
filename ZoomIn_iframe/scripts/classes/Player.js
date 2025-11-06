class Player {
  constructor(startPos) {
    this.position = { x: startPos.x, y: startPos.y };
    this.velocity = { x: 0, y: 0 };
    this.width = 30;
    this.height = 30;
    this.isOnPlatform = null;
    this.relativeY = 0;
  }

  draw(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(ctx, gravity, deltaTime = 1) {
    this.draw(ctx);
    if (this.isOnPlatform) {
      const p = this.isOnPlatform;
      this.position.y = p.position.y - this.height + this.relativeY;
    } else {
      this.position.y += this.velocity.y * deltaTime;
      if (this.position.y + this.height < ctx.canvas.height)  
        this.velocity.y += gravity * deltaTime;
      else this.velocity.y = 0;
    }
    this.position.x += this.velocity.x * deltaTime;
  }
}
