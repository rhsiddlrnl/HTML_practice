function loadMap(mapData) {
  const player = new Player(mapData.playerStart);
  const platforms = mapData.platforms.map(p => new Platform(p));
  const obstacles = mapData.obstacles.map(o => new Obstacle(o));
  const goal = new Goal(mapData.goal);
  const missiles = mapData.missiles ? mapData.missiles.map(m => new Missile(m)) : [];

  return { player, platforms, obstacles, goal, missiles };
}
