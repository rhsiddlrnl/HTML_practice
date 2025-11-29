class Lava {
  constructor({ x, y, width = 80, height = 20 }, image = null) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
    this.image = image;
    this.hitbox = {
      x: x - width / 2,
      y: y - height,
      width: width,
      height: height,
    };
  }

  draw(ctx) {
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.hitbox.x, this.hitbox.y, this.width, this.height);
    } else {
      ctx.fillStyle = "orange";
      ctx.fillRect(this.hitbox.x, this.hitbox.y, this.width, this.height);
    }
  }
}
