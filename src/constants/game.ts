const GAME_NAME_MAP = {
  mineSweeper: ["MINE", "SWEEPER"],
  tetris: ["TETRIS"],
  bounceBall: ["BOUNCE", "BALL"],
  flappyBoo: ["FLAPPY", "BOO"],
  shooting: ["SHOOT", "ALIENS"],
} as { [key: string]: string[] };

const GAME_BANNERS = {
  mineSweeper: "/assets/images/banner/mineSweeperBanner.png",
  tetris: "/assets/images/banner/tetrisBanner.png",
  bounceBall: "/assets/images/banner/bounceBallBanner.png",
  flappyBoo: "/assets/images/banner/flappyBooBanner.png",
  shooting: "/assets/images/banner/shootingBanner.png",
} as { [key: string]: string };

const GAME_DETAILS = {
  mineSweeper: {
    intro:
      "지뢰찾기는 논리적 추론을 통해 지뢰의 위치를 파악하는 퍼즐 게임입니다.",
    description: [
      "숫자는 주변 8칸의 지뢰 개수를 나타냅니다.",
      "우클릭시 깃발로 지뢰 위치를\n 표시할 수 있습니다.",
      "모든 지뢰를 빨리 찾을수록\n 점수가 높아집니다.",
    ],
  },
  tetris: {
    intro:
      "테트리스는 다양한 모양의 블록을 쌓아 줄을 완성하는 퍼즐 게임입니다.",
    description: [
      "방향키로 블록을 이동하고\n 회전시킬 수 있습니다.",
      "한 줄이 완성되면 해당 줄이 사라지고 점수를 획득합니다.",
      "블록이 천장에 닿으면 게임이 종료됩니다.",
    ],
  },
  bounceBall: {
    intro: "바운스볼은 패들로 공을 튕겨\n점수를 획득하는 게임입니다.",
    description: [
      "마우스로 패들을 이동합니다.",
      "떨어지는 공을 패들로 받아\n공을 튕깁니다.",
      "패들로 공을 맞추면 점수를 획득하고\n공이 땅에 닿으면 게임이 종료됩니다.",
    ],
  },
  flappyBoo: {
    intro:
      "플래피 부는 단순하지만 중독성 있는 게임으로, 스페이스바를 통해 유령을 조작하여 장애물을 피하는 방식으로 진행됩니다.",
    description: [
      "space를 눌러 유령을 위로 띄우세요.",
      "장애물을 피해 최대한 멀리 날아가 점수를 획득하세요.",
      "장애물에 부딪히거나 땅에 떨어지면 게임이 종료됩니다.",
    ],
  },
  shooting: {
    intro: "외계인 쏘기는 외계인을 피하고 공격하며 점수를 획득하는 게임입니다.",
    description: [
      "방향키로 이동하고 스페이스바로 공격할 수 있습니다.",
      "외계인을 맞추면 점수를 획득합니다.",
      "외계인이 지상에 닿으면 게임이 종료됩니다.",
    ],
  },
} as { [key: string]: { intro: string; description: string[] } };

export { GAME_NAME_MAP, GAME_BANNERS, GAME_DETAILS };
