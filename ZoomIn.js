// 🎮 Canvas 설정
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 800;   // 한 화면 내에서 진행되므로 고정 크기
canvas.height = 500;

const gravity = 0.5;

// 🎮 Player 클래스
class Player {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.width = 30;
        this.height = 30;
        this.isOnPlatform = null;
        this.relativeY = 0;
    }

    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        if (this.isOnPlatform) {
            const p = this.isOnPlatform;
            this.position.y = p.position.y - this.height + this.relativeY;
        } else {
            this.position.y += this.velocity.y;
            if (this.position.y + this.height < canvas.height)
                this.velocity.y += gravity;
            else this.velocity.y = 0;
        }

        this.position.x += this.velocity.x;
    }
}

// 🟦 Platform 클래스 (정사각형 + 고정 가능)
class Platform {
    constructor({ x, y, size = 100, fixed = false }) {
        this.position = { x, y };
        this.width = size;
        this.height = size;
        this.baseSize = size;
        this.fixed = fixed;
        this.targetSize = size;
    }

    draw() {
        c.fillStyle = this.fixed ? '#666' : 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    animateToSize(newSize) {
        if (this.fixed) return;
        const duration = 300;
        const startWidth = this.width;
        const diff = newSize - startWidth;
        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easedT = t * (2 - t);
            const size = startWidth + diff * easedT;

            const centerX = this.position.x + this.width / 2;
            const centerY = this.position.y + this.height / 2;

            this.width = size;
            this.height = size;
            this.position.x = centerX - size / 2;
            this.position.y = centerY - size / 2;

            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}

// 🔴 Obstacle 클래스
class Obstacle {
    constructor({ x, y, size = 80 }) {
        this.position = { x, y };
        this.width = size;
        this.height = size;
        this.baseSize = size;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    animateToSize(newSize) {
        const duration = 300;
        const startWidth = this.width;
        const diff = newSize - startWidth;
        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easedT = t * (2 - t);
            const size = startWidth + diff * easedT;

            const centerX = this.position.x + this.width / 2;
            const centerY = this.position.y + this.height / 2;

            this.width = size;
            this.height = size;
            this.position.x = centerX - size / 2;
            this.position.y = centerY - size / 2;

            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
}

// ⭐ Goal 클래스 (노란색 정사각형)
class Goal {
    constructor({ x, y, size = 80 }) {
        this.position = { x, y };
        this.width = size;
        this.height = size;
    }

    draw() {
        c.fillStyle = 'gold';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// 🎯 초기화
function init() {
    player = new Player();

    // 플랫폼, 장애물, 골인 배치 (모두 한 화면 안)
    platforms = [
        new Platform({ x: 50, y: 450 }),
        new Platform({ x: 200, y: 400 }),
        new Platform({ x: 350, y: 350 }),
        new Platform({ x: 500, y: 300 }),
        new Platform({ x: 650, y: 250, fixed: true }),
    ];

    obstacles = [
        new Obstacle({ x: 300, y: 450 }),
        new Obstacle({ x: 600, y: 400 }),
    ];

    goal = new Goal({ x: 700, y: 200 });
}

let player, platforms, obstacles, goal;
init();

let keys = {
    right: { pressed: false },
    left: { pressed: false }
};

let gameClear = false;

// 🎮 메인 루프
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // 배경
    c.fillStyle = '#b9dfff';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // 그리기
    goal.draw();
    platforms.forEach(p => p.draw());
    obstacles.forEach(o => o.draw());
    player.update();

    if (gameClear) {
        c.fillStyle = 'rgba(0,0,0,0.5)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'yellow';
        c.font = '48px sans-serif';
        c.textAlign = 'center';
        c.fillText('🎉 Game Clear! 🎉', canvas.width / 2, canvas.height / 2);
        return;
    }

    // 좌우 이동 (카메라 이동 없음)
    if (keys.right.pressed && player.position.x + player.width < canvas.width) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 0) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
    }

    // 플랫폼 충돌 감지
    let standingPlatform = null;
    platforms.forEach(p => {
        const onTop =
            player.position.y + player.height <= p.position.y &&
            player.position.y + player.height + player.velocity.y >= p.position.y &&
            player.position.x + player.width >= p.position.x &&
            player.position.x <= p.position.x + p.width;

        if (onTop) {
            player.velocity.y = 0;
            player.position.y = p.position.y - player.height;
            standingPlatform = p;
        }
    });

    if (standingPlatform) {
        if (player.isOnPlatform !== standingPlatform) {
            player.isOnPlatform = standingPlatform;
            player.relativeY = 0;
        }
    } else {
        player.isOnPlatform = null;
    }

    // 장애물 충돌 시 초기화
    obstacles.forEach(o => {
        const collided =
            player.position.x < o.position.x + o.width &&
            player.position.x + player.width > o.position.x &&
            player.position.y < o.position.y + o.height &&
            player.position.y + player.height > o.position.y;

        if (collided) {
            init();
        }
    });

    // 골인 감지
    if (
        player.position.x < goal.position.x + goal.width &&
        player.position.x + player.width > goal.position.x &&
        player.position.y < goal.position.y + goal.height &&
        player.position.y + player.height > goal.position.y
    ) {
        gameClear = true;
    }
}

animate();

// 🎮 키 입력 처리
addEventListener('keydown', ({ keyCode }) => {
    if (gameClear) return;

    switch (keyCode) {
        case 65: case 37: keys.left.pressed = true; break;
        case 68: case 39: keys.right.pressed = true; break;
        case 87: case 38:
            if (player.velocity.y === 0) player.velocity.y -= 15;
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: case 37: keys.left.pressed = false; break;
        case 68: case 39: keys.right.pressed = false; break;
    }
});

// 🔍 버튼 확대/축소
const zoomLevels = { small: 0.8, normal: 1.0, large: 1.2 };
let currentZoom = zoomLevels.normal;

const zoomSmall = document.getElementById('zoomSmall');
const zoomNormal = document.getElementById('zoomNormal');
const zoomLarge = document.getElementById('zoomLarge');

[zoomSmall, zoomNormal, zoomLarge].forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.zoom-buttons button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (btn === zoomSmall) currentZoom = zoomLevels.small;
        else if (btn === zoomNormal) currentZoom = zoomLevels.normal;
        else if (btn === zoomLarge) currentZoom = zoomLevels.large;

        resizeObjectsAnimated(currentZoom);
    });
});

// 🎮 부드러운 확대/축소 애니메이션
function resizeObjectsAnimated(scale) {
    [...platforms, ...obstacles].forEach(obj => {
        if (obj.fixed) return;
        const newSize = obj.baseSize * scale;
        obj.animateToSize(newSize);
    });
}
