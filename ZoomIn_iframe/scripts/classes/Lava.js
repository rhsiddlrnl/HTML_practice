class Lava {
  constructor({ x, y, width = 80, height = 20 }) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.hitbox = {
      x: x - width / 2,
      y: y - height,
      width: width,
      height: height,
    };
  }

  draw(ctx) {
    ctx.fillStyle = "orange";
    ctx.fillRect(this.hitbox.x, this.hitbox.y, this.width, this.height);
  }
}
