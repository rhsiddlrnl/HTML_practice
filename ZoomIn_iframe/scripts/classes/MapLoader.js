function loadMap(mapData) {
  const player = new Player(mapData.playerStart);
  const platforms = mapData.platforms.map(p => new Platform(p));
  const obstacles = mapData.obstacles.map(o => new Obstacle(o));
  const lavas = mapData.lavas ? mapData.lavas.map(l => new Lava(l)) : [];
  const goal = new Goal(mapData.goal);
  const missiles = mapData.missiles ? mapData.missiles.map(m => new Missile(m)) : [];

  const groundY = (typeof mapData.groundY !== 'undefined') ? mapData.groundY : 480;

  return { player, platforms, obstacles, lavas, goal, missiles, groundY };
}
