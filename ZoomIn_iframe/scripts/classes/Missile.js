class Missile {
  constructor({ x, y, speed = 3, delay = 2 }, image = null) {
    this.startPos = { x, y };
    this.position = { x, y };
    this.speed = speed;
    this.size = 20;
    this.angle = 0;

    this.delay = delay*1000;

    this.image = image;
    this.active = false;
    this.spawnTime = performance.now();
  }

  reset() {
    this.position = { ...this.startPos };
    this.active = false;
    this.spawnTime = performance.now();
  }

  update(c, player, platforms, obstacles, deltaTime = 1) {
    if (!deltaTime || deltaTime <= 0) deltaTime = 1;
    if (!player || !player.position) return;
    const now = performance.now();

    if (!this.active) {
      if (now - this.spawnTime >= this.delay) {
        this.active = true;
      } else {
        this.drawIdle(c);
        return;
      }
    }

    const dx = player.position.x + player.width / 2 - this.position.x;
    const dy = player.position.y + player.height / 2 - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      this.angle = Math.atan2(dy, dx);
      this.position.x += (dx / dist) * this.speed *deltaTime;
      this.position.y += (dy / dist) * this.speed *deltaTime;
    }

    const hitPlayer =
      this.position.x + this.size > player.position.x &&
      this.position.x < player.position.x + player.width &&
      this.position.y + this.size > player.position.y &&
      this.position.y < player.position.y + player.height;
    if (hitPlayer) {
      player.playDeathSound();
      this.reset();
      init();
      return;
    }

    const allBlocks = [...platforms, ...obstacles];
    for (const b of allBlocks) {
      const hb = b.hitbox;
      if (
        this.position.x + this.size > hb.x &&
        this.position.x < hb.x + (hb.width || hb.size) &&
        this.position.y + this.size > hb.y &&
        this.position.y < hb.y + (hb.height || hb.size)
      ) {
        this.reset();
        return;
      }
    }


    this.draw(c);
  }

  draw(c) {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.angle);
    if (this.image && this.image.complete) {
      c.drawImage(this.image, -this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      c.fillStyle = 'red';
      c.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    }
    c.fillStyle = 'red';

    c.restore();
  }

  drawIdle(c) {
    const pulse = Math.sin(performance.now() / 200) * 0.5 + 0.5;
    c.fillStyle = `rgba(255,0,0,${0.5 + pulse * 0.5})`;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.size / 2, 0, Math.PI * 2);
    c.fill();
  }
}
