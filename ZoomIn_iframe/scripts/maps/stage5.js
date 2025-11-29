const stage5 = {
  name: "Stage 5",
  playerStart: { x: 100, y: 200 },
  goal: { x: 700, y: 200 },
  groundY: null,
  platforms: [
    { x: 100, y: 280 },
    { x: 350, y: 350 },
    { x: 490, y: 470, size: 30 },
    { x: 600, y: 400 },
    {x : 700, y : 300}
  ],
  obstacles: [
    { x: 200, y: 180, size: 45 },
    { x: 580, y: 400, size: 30 }
  ],
  lavas: [
    { x: 400, y: 500, width: 800, height: 30 },
    { x: 450, y: 400, width: 80, height: 100 }
  ],
  missiles: []
};