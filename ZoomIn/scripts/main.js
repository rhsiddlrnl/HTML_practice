const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const gravity = 0.5;
const groundY = 480; // 바닥선 기준

let gameClear = false;
let gameClearing = false; // 골인 애니메이션 중 여부
let keys = { left: false, right: false };
let scaleMode = 1;

let player, platforms, obstacles, goal;

function init() {
  const map = loadMap(stage1);
  player = map.player;
  platforms = map.platforms;
  obstacles = map.obstacles;
  goal = map.goal;
  gameClear = false;
  gameClearing = false;
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // 배경
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // 바닥선
  c.fillStyle = '#888';
  c.fillRect(0, groundY, canvas.width, 20);

  goal.draw(c);
  platforms.forEach(p => p.draw(c, player));
  obstacles.forEach(o => o.draw(c));

  //클리어 애니메이션 중일 때
  if (gameClearing) {
    // 플레이어가 골 중심으로 이동 + 회전 + 축소
    const targetX = goal.position.x - player.width / 2;
    const targetY = goal.position.y - player.height / 2;

    player.position.x += (targetX - player.position.x) * 0.1;
    player.position.y += (targetY - player.position.y) * 0.1;

    player.rotation = (player.rotation || 0) + 0.3; // 회전
    player.scale = (player.scale || 1) * 0.94;      // 축소

    // 그리기
    c.save();
    c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
    c.rotate(player.rotation);
    c.scale(player.scale, player.scale);
    c.fillStyle = 'black';
    c.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    c.restore();

    // 일정 크기 이하로 작아지면 클리어 완료
    if (player.scale < 0.05) {
      gameClearing = false;
      gameClear = true;

     // 플레이어를 화면 밖으로 이동시켜 보이지 않게 처리
      player.position.x = -9999;
      player.position.y = -9999;
    }
    return;
  }

  //일반 플레이어 동작
  player.update(c, gravity);

  if (gameClear) {
    // 최종 클리어 메시지 출력
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'yellow';
    c.font = '48px sans-serif';
    c.textAlign = 'center';
    c.fillText('🎉 Game Clear! 🎉', canvas.width / 2, canvas.height / 2);
    return;
  }

  // 이동
  player.velocity.x = 0;
  if (keys.left && player.position.x > 0) player.velocity.x = -5;
  if (keys.right && player.position.x + player.width < canvas.width) player.velocity.x = 5;

  // 플랫폼 충돌 (모든 방향)
  platforms.forEach(p => {
    const hb = p.hitbox;
    const px = player.position.x;
    const py = player.position.y;
    const pw = player.width;
    const ph = player.height;

    const overlapX = px + pw > hb.x && px < hb.x + hb.size;
    const overlapY = py + ph > hb.y && py < hb.y + hb.size;

    if (overlapX && overlapY) {
      const fromLeft = px + pw - hb.x;
      const fromRight = hb.x + hb.size - px;
      const fromTop = py + ph - hb.y;
      const fromBottom = hb.y + hb.size - py;
      const minOverlap = Math.min(fromLeft, fromRight, fromTop, fromBottom);

      if (minOverlap === fromTop) {
        player.velocity.y = 0;
        player.position.y = hb.y - ph;
      } else if (minOverlap === fromBottom) {
        player.velocity.y = 0.5;
        player.position.y = hb.y + hb.size;
      } else if (minOverlap === fromLeft) {
        player.position.x = hb.x - pw;
      } else if (minOverlap === fromRight) {
        player.position.x = hb.x + hb.size;
      }
    }
  });

  // 장애물 충돌
  obstacles.forEach(o => {
    const hb = o.hitbox;
    const collided =
      player.position.x + player.width > hb.x &&
      player.position.x < hb.x + hb.size &&
      player.position.y + player.height > hb.y &&
      player.position.y < hb.y + hb.size;
    if (collided) init();
  });

  // 골 충돌 → 흡입 애니메이션 시작
  const goalTop = goal.position.y - goal.size;
  const goalLeft = goal.position.x - goal.size / 2;
  const goalRight = goal.position.x + goal.size / 2;
  const goalBottom = goal.position.y;

  const reachedGoal =
    player.position.x + player.width > goalLeft &&
    player.position.x < goalRight &&
    player.position.y + player.height > goalTop &&
    player.position.y < goalBottom;

  if (reachedGoal && !gameClear && !gameClearing) {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.rotation = 0;
    player.scale = 1;
    gameClearing = true;
  }

  // 바닥 충돌
  if (player.position.y + player.height >= groundY) {
    player.position.y = groundY - player.height;
    player.velocity.y = 0;
  }
}

init();
animate();

// 키 입력
window.addEventListener('keydown', (e) => {
  if (gameClear || gameClearing) return;
  switch (e.key) {
    case 'a':
    case 'ArrowLeft': keys.left = true; break;
    case 'd':
    case 'ArrowRight': keys.right = true; break;
    case 'w':
    case 'ArrowUp':
      if (Math.abs(player.velocity.y) < 1) player.velocity.y = -15;
      break;
  }
});
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'a':
    case 'ArrowLeft': keys.left = false; break;
    case 'd':
    case 'ArrowRight': keys.right = false; break;
  }
});

// 버튼 확대축소
const buttons = {
  small: document.getElementById('btn-small'),
  normal: document.getElementById('btn-normal'),
  large: document.getElementById('btn-large'),
};

function setSelected(id) {
  Object.values(buttons).forEach(btn => btn.classList.remove('selected'));
  buttons[id].classList.add('selected');
}

buttons.small.addEventListener('click', () => {
  scaleMode = 0.2;
  setSelected('small');
});
buttons.normal.addEventListener('click', () => {
  scaleMode = 1;
  setSelected('normal');
});
buttons.large.addEventListener('click', () => {
  scaleMode = 1.5;
  setSelected('large');
});
