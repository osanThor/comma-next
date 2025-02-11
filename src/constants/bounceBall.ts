const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;

// 1. 상수 정의 수정 (초당 속도로 변경)
const INITIAL_BALL_SPEED = 360; // 초당 360픽셀
const INITIAL_BALL_DX = () => (Math.random() * 2 - 1) * INITIAL_BALL_SPEED;
const INITIAL_BALL_DY = INITIAL_BALL_SPEED;
const SPEED_INCREASE = 24; // 초당 24픽셀씩 증가

const BALL_SIZE = 20;

export {
  GAME_WIDTH,
  GAME_HEIGHT,
  INITIAL_BALL_SPEED,
  INITIAL_BALL_DX,
  INITIAL_BALL_DY,
  SPEED_INCREASE,
  BALL_SIZE,
};
