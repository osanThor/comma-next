import { COLORS, SHAPES } from "@/constants/tetris";

export default class Piece {
  x: number = 0;
  y: number = 0;
  color: string = "";
  shape: number[][] = [];
  ctx: CanvasRenderingContext2D;
  typeId: number | null = null;
  hardDropped: boolean = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn(): void {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  draw(): void {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const px = this.x + x;
          const py = this.y + y;
          const blockSize = 1;

          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(px, py, blockSize, blockSize);

          this.ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          this.ctx.shadowBlur = 4;
          this.ctx.shadowOffsetX = 2;
          this.ctx.shadowOffsetY = 2;

          this.ctx.fillStyle = this.lightenColor(this.color, 80);
          this.ctx.fillRect(px, py, blockSize * 0.1, blockSize);
          this.ctx.fillStyle = this.lightenColor(this.color, 100);
          this.ctx.fillRect(px, py, blockSize, blockSize * 0.1);

          this.ctx.fillStyle = this.darkenColor(this.color, 100);
          this.ctx.fillRect(
            px + blockSize * 0.9,
            py,
            blockSize * 0.1,
            blockSize
          );
          this.ctx.fillRect(
            px,
            py + blockSize * 0.9,
            blockSize,
            blockSize * 0.1
          );

          this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          this.ctx.fillRect(px, py, blockSize * 0.15, blockSize * 0.15);

          this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          this.ctx.fillRect(
            px + blockSize * 0.85,
            py + blockSize * 0.85,
            blockSize * 0.15,
            blockSize * 0.15
          );
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

  move(p: Piece): void {
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  hardDrop(): void {
    this.hardDropped = true;
  }

  setStartingPosition(): void {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
