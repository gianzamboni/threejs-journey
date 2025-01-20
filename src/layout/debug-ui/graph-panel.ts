import { COLORS } from "@/theme";

function pixelRatioed(value: number) {
  return Math.round(window.devicePixelRatio || 1) * value;
}
export class GraphPanel {

  private context: CanvasRenderingContext2D;
  private canvasElement: HTMLCanvasElement;

  private title: string;

  private canvas = {
    width: pixelRatioed(80),
    height: pixelRatioed(48),
  }

  private text = {
    x: pixelRatioed(3),
    y: pixelRatioed(2),
  }

  private graph = {
    x: pixelRatioed(3),
    y: pixelRatioed(10),
    width: pixelRatioed(74),
    height: pixelRatioed(30),
  };

  private min = Infinity;
  private max = 0;

  constructor(name: string, parent: HTMLElement) {
    this.title = name;

    const canvas = this.initCanvas();
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Unable to get canvas context');
    };

    this.context = context;
    this.canvasElement = canvas;
    context.font = `${pixelRatioed(7)}px ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    context.textBaseline = 'top';
    context.textRendering = 'optimizeLegibility';

    context.fillStyle = COLORS.backgroundAlpha[50];
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    context.fillStyle = COLORS.debugLabel;
    context.fillText(name, this.text.x, this.text.y);

    context.fillStyle = "#000";
    context.fillRect(this.graph.x, this.graph.y, this.graph.width, this.graph.height);
    parent.appendChild(canvas);
  }


  update(value: number) {
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);

    this.context.clearRect(0, 0, this.canvas.width, this.graph.y);
    this.context.fillStyle = COLORS.backgroundAlpha[100];
    this.context.fillRect(0, 0, this.canvas.width, this.graph.y);

    this.context.fillStyle = COLORS.debugLabel;
    this.context.fillText(`${value} ${this.title} (${this.min}-${this.max})`, this.text.x, this.text.y);

    this.context.fillStyle = COLORS.graphColor;
    this.context.drawImage(this.canvasElement, 
      this.graph.x + pixelRatioed(1), 
      this.graph.y,
      this.graph.width - pixelRatioed(1), 
      this.graph.height, 
      this.graph.x, 
      this.graph.y, 
      this.graph.width - pixelRatioed(1), 
      this.graph.height
    );

    this.context.fillRect(this.graph.x + this.graph.width - pixelRatioed(1), this.graph.y, pixelRatioed(1), this.graph.height);

    this.context.fillStyle = "#000";
    this.context.fillRect(this.graph.x + this.graph.width - pixelRatioed(1), this.graph.y, pixelRatioed(1), Math.round((1 - (value / this.max)) * this.graph.height));
  }

  private initCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    return canvas;
  }

}