const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const gravity = 0.5;
let groundY; // 바닥선 기준

let unlockedStages = 1; // 현재 해금된 스테이지 수
let inStageSelect = true;

let gameClear = false;
let gameClearing = false; // 골인 애니메이션 중 여부
let keys = { left: false, right: false };
let scaleMode = 1;

let player, platforms, obstacles, goal;
let lavas = [];
let missiles = [];
// 스테이지 관련 변수
let currentStage = 1;
const maxStage = 2; // 스테이지 개수

// 스테이지 로드 함수
function loadStage() {
  let mapData;
  switch (currentStage) {
    case 1: mapData = stage1; break;
    case 2: mapData = stage2; break;
    default: mapData = stage1; break;
  }
  const map = loadMap(mapData);
  player = map.player;
  player.isGrounded = false;
  platforms = map.platforms;
  obstacles = map.obstacles;
  lavas = map.lavas;
  missiles = map.missiles;
  goal = map.goal;
  groundY = map.groundY;
}

function init() {
  loadStage();
  gameClear = false;
  gameClearing = false;
  console.log(`▶ Stage ${currentStage} 시작`);
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // 배경
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  if (groundY !== null) {
    c.fillStyle = '#888';
    c.fillRect(0, groundY, canvas.width, 20);
  }

  goal.draw(c);
  platforms.forEach(p => p.draw(c, player));
  obstacles.forEach(o => o.draw(c));
  lavas.forEach(l => l.draw(c));
  missiles.forEach(m => {
  m.update(c, player, platforms, obstacles);
  m.draw(c);
  });

  // 클리어 애니메이션
  if (gameClearing) {
    const targetX = goal.position.x - player.width / 2;
    const targetY = goal.position.y - player.height / 2;

    player.position.x += (targetX - player.position.x) * 0.1;
    player.position.y += (targetY - player.position.y) * 0.1;

    player.rotation = (player.rotation || 0) + 0.3;
    player.scale = (player.scale || 1) * 0.94;

    c.save();
    c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
    c.rotate(player.rotation);
    c.scale(player.scale, player.scale);
    c.fillStyle = 'black';
    c.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    c.restore();

    // 클리어 완료 시
    if (player.scale < 0.05) {
      gameClearing = false;
      player.position.x = -9999;
      player.position.y = -9999;

      if (currentStage < maxStage && unlockedStages === currentStage) unlockedStages++;

      if (currentStage < maxStage) {
      // 다음 스테이지 전용 클리어 메시지
        c.fillStyle = 'rgba(0,0,0,0.5)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'white';
        c.font = '40px sans-serif';
        c.textAlign = 'center';
        c.fillText(`Stage ${currentStage} Clear!`, canvas.width / 2, canvas.height / 2);

        // 1초 뒤 버튼 표시
        setTimeout(() => {
          document.getElementById('btn-next').style.display = 'inline-block';
          document.getElementById('btn-restart').style.display = 'inline-block';
          document.getElementById('btn-select').style.display = 'inline-block';
        }, 1000);
      } else {
      gameClear = true;
      // 마지막 스테이지에서도 버튼 표시
      document.getElementById('btn-restart').style.display = 'inline-block';
      document.getElementById('btn-select').style.display = 'inline-block';
      }
    }
    return;
  }

  // 최종 클리어 메시지
  if (gameClear) {
    c.fillStyle = 'rgba(0,0,0,0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.font = '48px sans-serif';
    c.textAlign = 'center';
    c.fillText('Clear', canvas.width / 2, canvas.height / 2);
    return;
  }

  // 플레이어 업데이트
  player.update(c, gravity);

  // 이동
  player.velocity.x = 0;
  if (keys.left && player.position.x > 0) player.velocity.x = -3;
  if (keys.right && player.position.x + player.width < canvas.width) player.velocity.x = 3;

  // 플랫폼 충돌
  platforms.forEach(p => {
    const hb = p.hitbox;
    const px = player.position.x;
    const py = player.position.y;
    const pw = player.width;
    const ph = player.height;

    const overlapX = px + pw > hb.x && px < hb.x + hb.width;
    const overlapY = py + ph > hb.y && py < hb.y + hb.height;

    if (overlapX && overlapY) {
      const fromLeft = px + pw - hb.x;
      const fromRight = hb.x + hb.width - px;
      const fromTop = py + ph - hb.y;
      const fromBottom = hb.y + hb.height - py;
      const minOverlap = Math.min(fromLeft, fromRight, fromTop, fromBottom);

      if (minOverlap === fromTop) {
        player.velocity.y = 0;
        player.position.y = hb.y - ph;
        player.isGrounded = true;
      } else if (minOverlap === fromBottom) {
        player.velocity.y = 0.5;
        player.position.y = hb.y + hb.height;
      } else if (minOverlap === fromLeft) {
        player.position.x = hb.x - pw;
      } else if (minOverlap === fromRight) {
        player.position.x = hb.x + hb.width;
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
    if (collided) {
      init();
      scaleMode = 1;
      setSelected('normal');
    }
  });

  lavas.forEach(l => {
    const hb = l.hitbox;
    const collided =
      player.position.x + player.width > hb.x &&
      player.position.x < hb.x + hb.width &&
      player.position.y + player.height > hb.y &&
      player.position.y < hb.y + hb.height;
    if (collided) {
      init();
      scaleMode = 1;
      setSelected("normal");
    }
  });

  // 골 충돌
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
    missiles = [];
  }

  // 바닥 충돌
  if (groundY !== null && groundY !== undefined) {
    if (player.position.y + player.height >= groundY) {
      player.position.y = groundY - player.height;
      player.velocity.y = 0;
      player.isGrounded = true;
    }
  } else {
    player.isGrounded = false;

    if (player.position.y > canvas.height + 100) {
    init();
    scaleMode = 1;
    setSelected('normal');
    return;
  }

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
  Object.values(buttons).forEach(btn => {
    btn.classList.remove('selected');
    btn.blur();
  });
  buttons[id].classList.add('selected');
}

buttons.small.addEventListener('click', () => {
  scaleMode = 0.3;
  setSelected('small');
});
buttons.normal.addEventListener('click', () => {
  scaleMode = 1;
  setSelected('normal');
});
buttons.large.addEventListener('click', () => {
  scaleMode = 3;
  setSelected('large');
});

function showStageSelect() {
  const selectUI = document.getElementById('stage-select');
  const canvas = document.querySelector('canvas');

  selectUI.style.display = 'block';
  canvas.style.display = 'none';

  // 스테이지 잠금 상태 업데이트
  document.querySelectorAll('.stage-btn').forEach(btn => {
    const stageNum = parseInt(btn.dataset.stage);
    if (stageNum <= unlockedStages) {
      btn.disabled = false;
      btn.classList.remove('locked');
      btn.classList.add('unlocked');
      btn.textContent = `Stage ${stageNum}`;
    } else {
      btn.disabled = true;
      btn.classList.remove('unlocked');
      btn.classList.add('locked');
      btn.textContent = `🔒 Stage ${stageNum}`;
    }
  });
}

document.querySelectorAll('.stage-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const stageNum = parseInt(btn.dataset.stage);
    currentStage = stageNum;
    inStageSelect = false;

    // UI 전환
    document.getElementById('stage-select').style.display = 'none';
    document.querySelector('canvas').style.display = 'block';

    init(); // 게임 시작
  });
});

window.onload = () => {
  showStageSelect();
};

document.getElementById('btn-next').addEventListener('click', () => {
  if (currentStage < maxStage) {
    currentStage++;
    hideOverlayButtons();
    init();
  } else {
    alert("모든 스테이지를 클리어했습니다!");
  }
});

// 다시 시작 버튼
document.getElementById('btn-restart').addEventListener('click', () => {
  hideOverlayButtons();
  init();
});

// 스테이지 선택 버튼
document.getElementById('btn-select').addEventListener('click', () => {
  hideOverlayButtons();
  showStageSelect();
});

// 버튼 숨김 함수
function hideOverlayButtons() {
  document.getElementById('btn-next').style.display = 'none';
  document.getElementById('btn-restart').style.display = 'none';
  document.getElementById('btn-select').style.display = 'none';
}