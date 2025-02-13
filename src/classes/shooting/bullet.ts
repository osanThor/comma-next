import {
  BULLET_SPEED,
  BULLET_X_OFFSET,
  HIT_BOX_PADDING,
} from "@/constants/shooting";
import { Enemy } from "./enemy";

export class Bullet {
  static bulletList: Bullet[] = [];
  x: number;
  y: number;
  alive: boolean;

  constructor(spaceshipX: number, spaceshipY: number) {
    this.x = spaceshipX + BULLET_X_OFFSET;
    this.y = spaceshipY;
    this.alive = true;

    Bullet.bulletList.push(this);
  }

  update(deltaTime: number) {
    this.y -= BULLET_SPEED * deltaTime;

    if (this.y < 0) {
      this.alive = false;
    }
  }

  checkHit(
    enemyList: Enemy[],
    setScore: React.Dispatch<React.SetStateAction<number>>
  ) {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x - HIT_BOX_PADDING &&
        this.x <= enemyList[i].x + HIT_BOX_PADDING
      ) {
        setScore((prev) => prev + 1);
        // score.value++;
        this.alive = false;
        enemyList.splice(i, 1);
        break;
      }
    }
  }
}
