import { SCALE_FACTOR } from "@/constants/flappy";
import {
  AnchorComp,
  AreaComp,
  BodyComp,
  GameObj,
  KAPLAYCtx,
  PosComp,
  ScaleComp,
  SpriteComp,
} from "kaplay";

interface PlayerController {
  isDead: boolean;
  speed: number;
  keyControllers: { cancel: () => void }[];
  setControls: () => void;
  disableControls: () => void;
}

export function makePlayer(
  k: KAPLAYCtx
): GameObj<
  | SpriteComp
  | AreaComp
  | AnchorComp
  | BodyComp
  | ScaleComp
  | PosComp
  | PlayerController
> {
  return k.add([
    k.sprite("boo"),
    k.area({ shape: new k.Rect(k.vec2(0, 1.5), 8, 5) }),
    k.anchor("center"),
    k.body({ jumpForce: 600 }),
    k.scale(SCALE_FACTOR),
    k.pos(150, 350),
    {
      isDead: false,
      speed: 600,
      keyControllers: [],
      setControls() {
        const jumpLogic = () => {
          k.play("jump", { volume: 0.02 });
          (this as GameObj<PlayerController & BodyComp>).jump();
        };

        this.keyControllers.push(k.onKeyPress("space", jumpLogic));
      },
      disableControls() {
        (this as GameObj<PlayerController>).keyControllers.forEach(
          (keyController) => keyController.cancel()
        );
      },
    } as PlayerController,
  ]);
}
