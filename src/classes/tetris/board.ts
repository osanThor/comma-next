import {
  COLS,
  ROWS,
  BLOCK_SIZE,
  LINES_PER_LEVEL,
  COLORS,
  KEY,
  POINTS,
  LEVEL,
  ROTATION,
} from "@/constants/tetris";
import Piece from "./piece";
import { RefObject } from "react";

// Type Definitions
type Account = {
  score: number;
  lines: number;
  level: number;
};

type Time = React.RefObject<{
  start: number;
  elapsed: number;
  level: number;
}>;

export default class Board {
  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  grid: number[][];
  piece: Piece;
  next: Piece;

  constructor(
    ctx: CanvasRenderingContext2D,
    ctxNext: CanvasRenderingContext2D
  ) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.next = new Piece(this.ctxNext);
    this.init();
  }

  init(): void {
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  reset(): void {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  getNewPiece(): void {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  draw(): void {
    this.piece.draw();
    this.drawBoard();
  }

  drop(
    moves: {
      [x: number]: (p: Piece) => Piece;
    },
    account: RefObject<Account>,
    time: Time,
    pointsSound: HTMLAudioElement
  ): boolean {
    const p = moves[KEY.DOWN](this.piece) as Piece;
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines(account, time, pointsSound);
      if (this.piece.y === 0) {
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  clearLines(
    account: RefObject<Account>,
    time: Time,
    pointsSound: HTMLAudioElement
  ): void {
    let lines = 0;

    this.grid.forEach((row, y) => {
      if (row.every((value) => value > 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      account.current.score =
        account.current.score +
        this.getLinesClearedPoints(lines, account.current, pointsSound);
      account.current.lines = account.current.lines + lines;
      console.log(account.current);
      if (account.current.lines >= LINES_PER_LEVEL) {
        account.current.level = account.current.level + 1;

        account.current.lines = account.current.lines - LINES_PER_LEVEL;
        time.current.level = LEVEL[account.current.level + 1];
      }
    }
  }

  valid(p: Piece): boolean {
    return p.shape.every((row, dy) =>
      row.every((value, dx) => {
        const x = p.x + dx;
        const y = p.y + dy;
        return (
          value === 0 || (this.isInsideWalls(x, y) && this.notOccupied(x, y))
        );
      })
    );
  }

  freeze(): void {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0 && this.piece.typeId) {
          this.grid[y + this.piece.y][x + this.piece.x] = this.piece.typeId;
        }
      });
    });
  }

  drawBoard(): void {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const px = x;
          const py = y;
          const blockSize = 1;
          const color = COLORS[value];

          if (!color) return;

          this.ctx.fillStyle = color;
          this.ctx.fillRect(px, py, blockSize, blockSize);

          this.ctx.strokeStyle = this.darkenColor(color, 50);
          this.ctx.lineWidth = 0.05;
          this.ctx.strokeRect(px, py, blockSize, blockSize);

          this.ctx.fillStyle = this.lightenColor(color, 70);
          this.ctx.fillRect(px, py, blockSize * 0.1, blockSize);
          this.ctx.fillStyle = this.lightenColor(color, 100);
          this.ctx.fillRect(px, py, blockSize, blockSize * 0.1);
        }
      });
    });
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00ff) + amt;
    const b = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (r < 255 ? r : 255) * 0x10000 +
      (g < 255 ? g : 255) * 0x100 +
      (b < 255 ? b : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  darkenColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) - amt;
    const g = ((num >> 8) & 0x00ff) - amt;
    const b = (num & 0x0000ff) - amt;
    return `#${(
      0x1000000 +
      (r > 80 ? r : 80) * 0x10000 +
      (g > 80 ? g : 80) * 0x100 +
      (b > 80 ? b : 80)
    )
      .toString(16)
      .slice(1)}`;
  }

  getEmptyGrid(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  isInsideWalls(x: number, y: number): boolean {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  notOccupied(x: number, y: number): boolean {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  rotate(piece: Piece, direction: string): Piece {
    const p = JSON.parse(JSON.stringify(piece)) as Piece;

    if (!piece.hardDropped) {
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
      if (direction === ROTATION.RIGHT) {
        p.shape.forEach((row) => row.reverse());
      } else if (direction === ROTATION.LEFT) {
        p.shape.reverse();
      }
    }
    return p;
  }

  getLinesClearedPoints(
    lines: number,
    account: Account,
    pointsSound: HTMLAudioElement
  ): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;
    pointsSound.play();
    return (account.level + 1) * lineClearPoints;
  }
}
