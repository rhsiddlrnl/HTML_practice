function loadMap(mapData) {
  const playerIdleImage = new Image();
  const playerJumpImage = new Image();
  const playerJumpSound = new Audio();
  const playerDeathSound = new Audio();
  const platformImage = new Image();
  const fixedPlatformImage = new Image();
  const obstacleImage = new Image();
  const lavaImage = new Image();
  const goalImage = new Image();
  const missileImage = new Image();
  
  playerIdleImage.src = 'player.png';
  playerJumpImage.src = 'playerJump.png';
  playerJumpSound.src = 'jump.mp3';
  playerDeathSound.src = 'death.mp3';
  platformImage.src = 'platform.png';
  fixedPlatformImage.src = 'fixedPlatform.png';
  obstacleImage.src = 'obstacle.png';
  lavaImage.src = 'lava.png';
  goalImage.src = 'goal.png';
  missileImage.src = 'missile.png';

  const player = new Player(mapData.playerStart, playerIdleImage, playerJumpImage, playerJumpSound, playerDeathSound);
  const platforms = mapData.platforms.map(p => new Platform(p, platformImage, fixedPlatformImage));
  const obstacles = mapData.obstacles.map(o => new Obstacle(o, obstacleImage));
  const lavas = mapData.lavas ? mapData.lavas.map(l => new Lava(l, lavaImage)) : [];
  const goal = new Goal(mapData.goal, goalImage);
  const missiles = mapData.missiles ? mapData.missiles.map(m => new Missile(m, missileImage)) : [];

  const groundY = (typeof mapData.groundY !== 'undefined') ? mapData.groundY : 480;

  
  

  return { player, platforms, obstacles, lavas, goal, missiles, groundY };
}
