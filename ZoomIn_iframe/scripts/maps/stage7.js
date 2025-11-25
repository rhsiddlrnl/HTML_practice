const stage7 = {
  name: "Stage 7",
  playerStart: { x: 100, y: 350 },
  goal: { x: 700, y: 150 },
  groundY: 480,
  platforms: [
    { x: 100, y: 430, size: 40, fixed:true},
    { x: 250, y: 400, size: 40},
    { x: 430, y: 300, size: 40},
    { x: 500, y: 220, size: 30}
  ],
  obstacles: [
    {x:220,y:360,size:20},
    {x:400,y:290,size:20},
    {x:600,y:150,size:30}
  ],
  lavas: [
    { x: 400, y: 500, width: 800, height: 30 }
  ],
  missiles: [
    { x: 100, y: 180, speed: 3, delay : 1 }
  ]
};