"use strict";
export const COLS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export const LINES_PER_LEVEL = 10;
export const COLORS = [
  "none",
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red",
];

export const SHAPES = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3], // 0,0 -> 2,0 ; 0,1 -> 1,0 ; 0,2 -> 0,0
    [3, 3, 3], // 1,0 -> 2,1 ; 1,1 -> 1,1 ; 1,2 -> 0,1
    [0, 0, 0],
  ], // 2,0 -> 2,2 ; 2,1 -> 1,2 ; 2,2 -> 0,2
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];

export const KEY = {
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  P: 80,
  Q: 81,
};

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
} as { [key: string]: number };

export const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
  // 29+ is 20ms
} as { [key: number]: number };

export const ROTATION = {
  LEFT: "left",
  RIGHT: "right",
};

[COLORS, SHAPES, KEY, POINTS, LEVEL, ROTATION].forEach((item) =>
  Object.freeze(item)
);
