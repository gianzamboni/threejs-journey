export class DisplacementEngine {

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private glow: HTMLImageElement;

  constructor() {
    this.canvas = this.createCanvas();
    this.ctx = this.getContext();
    this.glow = this.createGlow();

    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  dispose() {
    this.canvas.remove();
  }

  private createGlow() {
    const img = new Image();
    img.src = "imgs/glow.png";
    return img;
  }

  private getContext() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }
    return ctx;
  }

  private createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);
    return canvas;
  }
}