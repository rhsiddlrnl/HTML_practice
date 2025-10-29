const stage1 = {
  name: "Stage 1",
  playerStart: { x: 100, y: 430 }, // 플레이어 바닥선 기준
  goal: { x: 700, y: 480 },
  platforms: [
    { x: 200, y: 480 }, // 바닥선 위
    { x: 400, y: 380 }, // 공중 발판
  ],
  obstacles: [
    { x: 550, y: 480 }  // 바닥 위 장애물
  ]
};
