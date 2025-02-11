import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_BOX_PADDING,
  ENEMY_SPEED,
} from "@/constants/shooting";

export class Enemy {
  static enemyList = [];
  static isGameOver = false;

  constructor(generateRandomValue) {
    this.x = generateRandomValue(
      ENEMY_BOX_PADDING,
      CANVAS_WIDTH - ENEMY_WIDTH - ENEMY_BOX_PADDING
    );
    this.y = 0;

    Enemy.enemyList.push(this);
  }

  update(deltaTime) {
    // deltaTime 적용: ENEMY_SPEED * deltaTime
    this.y += ENEMY_SPEED * deltaTime;

    if (this.y >= CANVAS_HEIGHT - ENEMY_HEIGHT) {
      Enemy.isGameOver = true;
    }
  }
}
