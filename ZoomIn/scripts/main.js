const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const gravity = 0.5;
const groundY = 480; // 바닥선 기준

let gameClear = false;
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
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // 배경
  c.fillStyle = '#b9dfff';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // 바닥선 시각적으로 표시
  c.fillStyle = '#888';
  c.fillRect(0, groundY, canvas.width, 20);

  goal.draw(c);
  platforms.forEach(p => p.draw(c));
  obstacles.forEach(o => o.draw(c));
  player.update(c, gravity);

  if (gameClear) {
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

// 플랫폼 충돌 (플레이어가 위에 서도록 정확히 조정)
let standingPlatform = null;
platforms.forEach(p => {
  const hb = p.hitbox;

  // 플랫폼 상단면과 플레이어 하단면이 거의 맞닿을 때
  const playerBottom = player.position.y + player.height;
  const platformTop = hb.y;

  const horizontallyAligned =
    player.position.x + player.width > hb.x &&
    player.position.x < hb.x + hb.size;

  const verticallyTouching =
    playerBottom <= platformTop + 10 && // 살짝 여유
    playerBottom + player.velocity.y >= platformTop &&
    player.velocity.y >= 0;

  if (horizontallyAligned && verticallyTouching) {
    player.velocity.y = 0;
    player.position.y = platformTop - player.height;
    standingPlatform = p;
  }
});

player.isOnPlatform = standingPlatform;

// 장애물 충돌 (hitbox 기준)
obstacles.forEach(o => {
  const hb = o.hitbox;
  const collided =
    player.position.x + player.width > hb.x &&
    player.position.x < hb.x + hb.size &&
    player.position.y + player.height > hb.y &&
    player.position.y < hb.y + hb.size;

  if (collided) {
    init(); // 즉시 재시작
  }
});

// 골 충돌 (center-bottom 피봇 반영)
const goalTop = goal.position.y - goal.size;
const goalLeft = goal.position.x - goal.size / 2;
const goalRight = goal.position.x + goal.size / 2;
const goalBottom = goal.position.y;

const reachedGoal =
  player.position.x + player.width > goalLeft &&
  player.position.x < goalRight &&
  player.position.y + player.height > goalTop &&
  player.position.y < goalBottom;

if (reachedGoal) {
  gameClear = true;
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
  if (gameClear) return;
  switch (e.key) {
    case 'a':
    case 'ArrowLeft': keys.left = true; break;
    case 'd':
    case 'ArrowRight': keys.right = true; break;
    case 'w':
    case 'ArrowUp':
      if (player.velocity.y === 0) player.velocity.y = -15;
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

// 🎮 버튼으로 오브젝트 크기 조절
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
  scaleMode = 2;
  setSelected('large');
});
