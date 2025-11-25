const stage8 = {
  name: "Stage 8",
  playerStart: { x: 50, y: 40 }, // 플레이어 바닥선 기준
  goal: { x: 750, y: 500 },
  groundY: 500,
  platforms: [
    {x:15, y: 50, size: 40, fixed : true},
    {x:95, y : 50, size: 40, fixed : true},
    {x:30, y : 90, size: 40},
    {x:80, y : 90, size: 40},
    {x:50, y : 170, size: 20},
    {x:15, y : 270, size: 20},
    {x:95, y : 270, size: 20},
    {x:10, y : 330, size: 20,fixed : true},
    {x:70, y : 330, size: 20,fixed : true},
    {x:125, y : 330, size: 20,fixed : true},
    {x:270, y : 500, size: 20},
    {x:180, y : 420, size: 20},
    {x:270, y : 340, size: 20},
    {x:270, y : 240, size: 20},
    {x:180, y : 160, size: 20},
    {x:180, y : 60, size: 20},
    {x:370, y : 100, size: 50},
    {x:320, y : 160, size: 20, fixed : true},
    {x:340, y : 160, size: 20, fixed : true},
    {x:400, y : 160, size: 20, fixed : true},
    {x:420, y : 160, size: 20, fixed : true},
    {x:440, y : 160, size: 20, fixed : true},
    {x:320, y : 210, size: 20, fixed : true},
    {x:340, y : 210, size: 20, fixed : true},
    {x:360, y : 210, size: 20, fixed : true},
    {x:380, y : 210, size: 20, fixed : true},
    {x:440, y : 210, size: 20, fixed : true},
    {x:320, y : 260, size: 20, fixed : true},
    {x:340, y : 260, size: 20, fixed : true},
    {x:400, y : 260, size: 20, fixed : true},
    {x:420, y : 260, size: 20, fixed : true},
    {x:440, y : 260, size: 20, fixed : true},
    {x:320, y : 310, size: 20, fixed : true},
    {x:340, y : 310, size: 20, fixed : true},
    {x:360, y : 310, size: 20, fixed : true},
    {x:440, y : 310, size: 20, fixed : true},
    {x:420, y : 310, size: 20, fixed : true},
    {x:320, y : 360, size: 20, fixed : true},
    {x:340, y : 360, size: 20, fixed : true},
    {x:400, y : 360, size: 20, fixed : true},
    
  ],
  obstacles: [
    {x:50, y: 190, size: 40},
    {x:340, y: 450, size: 25},
    {x:410, y: 450, size: 25}
  ],
  lavas: [
    {x:150, y:460, width: 10, height : 600},
    {x:0, y:400, width: 40, height : 10},
    {x:110, y:400, width: 80, height : 10},
    {x:300, y:650, width: 10, height : 620},
    {x:450, y:460, width: 10, height : 600}
  ],
  missiles: [

  ]
};
