function loadMap(mapData) {
  const playerIdleImage = new Image();
  const playerJumpImage = new Image();
  const playerJumpSound = new Audio();
  const playerDeathSound = new Audio();
  const goalImage = new Image();
  
  playerIdleImage.src = 'player.png';
  playerJumpImage.src = 'playerJump.png';
  playerJumpSound.src = 'jump.mp3';
  playerDeathSound.src = 'death.mp3';
  goalImage.src = 'goal.png';

  const player = new Player(mapData.playerStart, playerIdleImage, playerJumpImage, playerJumpSound, playerDeathSound);
  const platforms = mapData.platforms.map(p => new Platform(p));
  const obstacles = mapData.obstacles.map(o => new Obstacle(o));
  const lavas = mapData.lavas ? mapData.lavas.map(l => new Lava(l)) : [];
  const goal = new Goal(mapData.goal, goalImage);
  const missiles = mapData.missiles ? mapData.missiles.map(m => new Missile(m)) : [];

  const groundY = (typeof mapData.groundY !== 'undefined') ? mapData.groundY : 480;

  
  

  return { player, platforms, obstacles, lavas, goal, missiles, groundY };
}
