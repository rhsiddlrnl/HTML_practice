class Player {
  constructor(startPos, image = null, jumpImage = null, jumpSound = null, deathSound = null) {
    this.position = { x: startPos.x, y: startPos.y };
    this.velocity = { x: 0, y: 0 };
    this.width = 30;
    this.height = 30;
    this.isOnPlatform = null;
    this.relativeY = 0;
    this.isGrounded = false;

    this.image = image;
    this.jumpImage = jumpImage;
    this.jumpSound = jumpSound;
    this.deathSound = deathSound;

    this.facing = 1;
  }

  draw(ctx) {
    let img = this.isGrounded ? this.image : this.jumpImage;

    if (img && img.complete) {
      ctx.save();
      
      ctx.translate(this.position.x + this.width / 2, this.position.y);
      ctx.scale(this.facing, 1); // facing이 1이면 그대로, -1이면 좌우 반전
      
      ctx.drawImage(img, -this.width / 2, 0, this.width, this.height);

      ctx.restore();
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }

  update(ctx, gravity, deltaTime = 1) {
    this.draw(ctx);
    
    this.position.y += this.velocity.y * deltaTime;
    if (this.position.y + this.height < ctx.canvas.height)  
      this.velocity.y += gravity * deltaTime;
    else this.velocity.y = 0;
    
    this.position.x += this.velocity.x * deltaTime;
  }

  playJumpSound() {
        if (this.jumpSound) {
            // 사운드를 처음부터 재생하여 단발성 효과음처럼 작동하게 합니다.
            this.jumpSound.currentTime = 0; 
            this.jumpSound.play().catch(e => {
                // 브라우저 자동 재생 정책으로 인한 에러를 무시합니다.
                if (e.name !== 'NotAllowedError') {
                    console.error("점프 사운드 재생 오류:", e);
                }
            });
        }
    }
    
  playDeathSound() {
        if (this.deathSound) {
            this.deathSound.currentTime = 0; // 사운드를 처음부터 재생
            this.deathSound.play().catch(e => {
                if (e.name !== 'NotAllowedError') {
                    console.error("죽음 사운드 재생 오류:", e);
                }
            });
        }
    }
}
