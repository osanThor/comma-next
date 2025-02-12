"use client";

import { makeBackground } from "@/classes/flappy/makeBackground";
import { makePlayer } from "@/classes/flappy/makePlayer";
import { SCALE_FACTOR } from "@/constants/flappy";
import useTimer from "@/hooks/timer";
import kaplay, {
  GameObj,
  KAPLAYCtx,
  PosComp,
  ScaleComp,
  SpriteComp,
  TextCompOpt,
} from "kaplay";
import { useEffect, useRef } from "react";

export default function FlappyBooContainer() {
  const { currentTime, start, stop, reset } = useTimer();

  const currentTimeRef = useRef(currentTime);

  const gameCanvas = useRef<HTMLCanvasElement>(null);
  const audioEnabled = useRef(true);
  const isGameStarted = useRef(false);
  const k = useRef<KAPLAYCtx>(null);
  const audioContext = useRef<AudioContext>(null);

  const SCORE_LABEL_CONFIG = {
    font: "Pixel_NES",
    size: 32,
    styles: {
      bold: true,
      shadow: {
        color: k.current?.rgb(0, 0, 0),
        blur: 4,
        offset: k.current?.vec2(2, 2),
      },
    },
  } as unknown as TextCompOpt;

  const setCanvasSize = () => {
    const canvas = gameCanvas.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };
  const resumeAudioContext = () => {
    if (!audioContext || !audioContext.current) {
      audioContext.current = new AudioContext();
    }
    audioContext.current.resume().then(() => {
      console.log("Audio context resumed");
    });
  };

  const startGame = () => {
    if (!k.current) return;
    isGameStarted.current = true;
    k.current.setGravity(2500);
    start();
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const handleInitialize = async () => {
      const canvas = gameCanvas.current;
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      if (k.current) {
        console.warn("KAPLAY already initialized, skipping reinitialization.");
        return;
      }

      k.current = kaplay({
        width: 1300,
        height: 750,
        letterbox: true,
        global: false,
        canvas: canvas,
      });

      if (!k.current) return;
      await k.current.loadFont("Pixel_NES", "/assets/fonts/Pixel_NES.otf");

      k.current.loadSprite("sky", "/assets/images/game/flappy/2.png");
      k.current.loadSprite("field", "/assets/images/game/flappy/3.png");
      k.current.loadSprite("boo", "/assets/images/game/flappy/Boo.png");
      k.current.loadSprite(
        "obstacles",
        "/assets/images/game/flappy/obstacles.png"
      );
      k.current.loadSprite("playBtn", "/assets/images/game/flappy/playBtn.png");
      k.current.loadSprite("clouds", "/assets/images/game/flappy/clouds.png");
      k.current.loadSound("jump", "/assets/images/game/flappy/jump.wav");
      k.current.loadSound("hurt", "/assets/images/game/flappy/hurt.wav");
      k.current.loadSound("confirm", "/assets/images/game/flappy/poka02.mp3");

      // 시작 화면 씬
      k.current.scene("start", async () => {
        if (!k.current) return;
        makeBackground(k.current);
        //배경 추가
        const map = k.current.add([
          k.current.pos(0, 0),
          k.current.scale(SCALE_FACTOR),
        ]);
        const clouds = map.add([
          k.current.sprite("clouds"),
          k.current.pos(),
          { speed: 5 },
        ]);
        clouds.onUpdate(() => {
          clouds.move(clouds.speed, 0);
          if (clouds.pos.x > 700) clouds.pos.x = -500;
        });

        map.add([
          k.current.sprite("obstacles"),
          k.current.pos(),
          k.current.area(),
          { speed: 100 },
        ]);

        const player = makePlayer(k.current);
        player.pos = k.current.vec2(
          k.current.center().x - 350,
          k.current.center().y + 40
        );

        const playBtn = k.current.add([
          k.current.sprite("playBtn"),
          k.current.scale(0.35),
          k.current.area(),
          k.current.anchor("center"),
          k.current.pos(k.current.center().x + 20, k.current.center().y + 40),
        ]);

        const goToGame = () => {
          resumeAudioContext();

          if (!k.current) return;
          if (audioEnabled.current) k.current.play("confirm");
          k.current.go("main");
        };

        playBtn.onClick(goToGame);
        k.current.onKeyPress("space", goToGame);
      });

      // 메인 게임 씬
      k.current.scene("main", async () => {
        // debug.inspect = true; // 디버깅 코드
        if (!k.current) return;
        let score = 0;
        isGameStarted.current = false;
        makeBackground(k.current);

        const map = k.current.add([
          k.current.pos(0, 0),
          k.current.scale(SCALE_FACTOR),
        ]);

        const scoreLabel = k.current.add([
          k.current.text(`Score: ${score}`, {
            ...SCORE_LABEL_CONFIG,
            size: SCORE_LABEL_CONFIG.size,
            font: SCORE_LABEL_CONFIG.font,
          }),
          k.current.pos(50, 50),
          k.current.fixed(),
          k.current.z(100),
          k.current.color(255, 255, 255),
          {
            updateScore: (newScore: number) => {
              scoreLabel.text = `Score: ${newScore}`;
            },
          },
        ]);

        const clouds = [] as GameObj<
          | PosComp
          | SpriteComp
          | {
              speed: number;
            }
        >[];

        const cloudSpeed = 5;

        for (let i = 0; i < 2; i++) {
          const cloud = map.add([
            k.current.sprite("clouds"),
            k.current.pos(i * 900, 10),
            { speed: cloudSpeed },
          ]);
          clouds.push(cloud);
        }

        k.current.onUpdate(() => {
          if (isGameStarted.current) {
            clouds.forEach((cloud) => {
              cloud.move(cloud.speed, 0);

              if (cloud.pos.x > canvas.width) {
                cloud.pos.x = -cloud.width;
              }
            });
          }
        });

        const colliders = await (
          await fetch("/assets/images/game/flappy/collidersData.json")
        ).json();
        const collidersData = colliders.data;

        const IMAGE_WIDTH = 480 * SCALE_FACTOR;
        const obstaclesLayer = {
          speed: -100,
          parts: [
            k.current.add([
              k.current.sprite("obstacles"),
              k.current.pos(0, 0),
              k.current.area(),
              k.current.scale(SCALE_FACTOR),
            ]),
            k.current.add([
              k.current.sprite("obstacles"),
              k.current.pos(IMAGE_WIDTH, 0),
              k.current.area(),
              k.current.scale(SCALE_FACTOR),
            ]),
          ],
        };

        let lastUpdateTime = performance.now();
        k.current.onUpdate(() => {
          const currentTime = performance.now();
          const deltaTime = (currentTime - lastUpdateTime) / 1000;
          lastUpdateTime = currentTime;

          if (isGameStarted.current) {
            for (let i = 0; i < obstaclesLayer.parts.length; i++) {
              const currentPart = obstaclesLayer.parts[i];
              const nextPart =
                obstaclesLayer.parts[(i + 1) % obstaclesLayer.parts.length];

              if (currentPart.pos.x < -IMAGE_WIDTH) {
                currentPart.pos.x = nextPart.pos.x + IMAGE_WIDTH;
              }
              currentPart.move(obstaclesLayer.speed * deltaTime * 60, 0);
            }
          }
          if (isGameStarted.current) {
            obstaclesLayer.speed -= 5 * deltaTime;
          }
        });

        k.current.loop(1, () => {
          if (isGameStarted.current && !player.isDead) {
            score += 50;
            scoreLabel.updateScore(score);
          }
        });

        for (const collider of collidersData) {
          for (const part of obstaclesLayer.parts) {
            part.add([
              k.current.area({
                shape: new k.current.Rect(
                  k.current.vec2(0),
                  collider.width,
                  collider.height
                ),
              }),
              k.current.body({ isStatic: true }),
              k.current.pos(collider.x, collider.y),
              "obstacle",
            ]);
          }
        }

        k.current.add([
          k.current.rect(k.current.width(), 50),
          k.current.pos(0, -50),
          k.current.area(),
          "obstacle",
        ]);
        k.current.add([
          k.current.rect(k.current.width(), 50),
          k.current.pos(0, 1000),
          k.current.area(),
          "obstacle",
        ]);

        k.current.onKeyPress("space", () => {
          if (!isGameStarted.current) {
            startGame();
          } else if (!player.isDead) {
            player.jump(400);
            if (audioEnabled.current && k.current)
              k.current.play("jump", { volume: 0.02 });
          }
        });

        const player = makePlayer(k.current);
        player.pos = k.current.vec2(
          k.current.center().x - 200,
          k.current.center().y
        );
        player.setControls();

        // 충돌한 후 게임 점수/타임 기록
        player.onCollide("obstacle", async () => {
          if (player.isDead || !k.current) return;

          if (audioEnabled.current) k.current.play("hurt");
          player.isDead = true;
          player.disableControls();
          isGameStarted.current = false;
          obstaclesLayer.speed = 0;
          (map as GameObj<ScaleComp | PosComp | { speed: number }>).speed = 0;

          stop();

          console.log("gameOver", score, currentTimeRef.current);
          // emit("open-game-over", score, currentTime.value);
          reset();
        });

        k.current.setCamScale(k.current.vec2(1.2));
        player.onUpdate(() => {
          if (isGameStarted.current && !player.isDead && k.current) {
            k.current.setCamPos(player.pos.x + 100, 400);
          }
        });
      });

      // 게임 시작
      k.current.go("start");
    };
    handleInitialize();
    return () => {
      window.removeEventListener("resize", setCanvasSize);

      if (k.current) {
        k.current = null;
        console.log("KAPLAY instance destroyed");
        window.location.reload();
      }

      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close();
        audioContext.current = null;
      }
    };
  }, []);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  return (
    <div className="game-scene">
      <canvas
        ref={gameCanvas}
        width="1300"
        height="750"
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
}
