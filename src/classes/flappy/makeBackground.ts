import { SCALE_FACTOR } from "@/constants/flappy";

export function makeBackground(k: any) {
  // 하늘
  const sky = k.add([
    k.sprite("sky"),
    k.pos(0, 0),
    k.scale(SCALE_FACTOR),
    { speed: 20 },
  ]);

  // 필드
  const field = k.add([
    k.sprite("field"),
    k.pos(0, k.height() - 300),
    k.scale(SCALE_FACTOR),
    { speed: 100 },
  ]);

  // 배경 스크롤 효과 구현
  sky.onUpdate(() => {
    sky.move(-sky.speed, 0);
    if (sky.pos.x <= -sky.width) {
      sky.pos.x = 0;
    }
  });

  field.onUpdate(() => {
    field.move(-field.speed, 0);
    if (field.pos.x <= -field.width) {
      field.pos.x = 0;
    }
  });
}
