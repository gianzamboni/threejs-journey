import { COLORS } from "@/theme";

type SizesConfig = {
  canvas: {
    width: number;
    height: number;
  },
  title: {
    xPos: number;
    yPos: number;
  },
  graph: {
    xPos: number;
    yPos: number;
    width: number;
    height: number;
  },
  fontSize: number;
}
export class GraphPanel {
  
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private sizes: SizesConfig;
  private minValue: number = Infinity;
  private maxValue: number = 0;
  private name: string;

  constructor(name: string, parent: HTMLElement) {
    this.name = name;
    this.sizes = this.getSizes();
    
    this.canvas = this.createCanvas();
    const context = this.canvas.getContext('2d');
    if(context === null) {
      throw new Error('Unable to get canvas context');
    }

    this.context = context;
    this.context.font = `bold ${this.sizes.fontSize}px Helvetica,Arial,sans-serif`;
    this.context.textBaseline = 'top';
    

    this.context.fillStyle = COLORS.black[60];
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = COLORS.black[100];
    this.context.fillRect(this.sizes.graph.xPos, this.sizes.graph.yPos, this.sizes.graph.width, this.sizes.graph.height);
    parent.appendChild(this.canvas);
  }


  update(value: number) {
    this.minValue = Math.min(this.minValue, value);
    this.maxValue = Math.max(this.maxValue, value);

    this.drawTitle(value);
    this.drawGraph(value);    
  }
  
  dispose() {
    this.canvas.remove();
  }

  private drawTitle(value: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.sizes.fontSize + 4);
    this.context.fillStyle = COLORS.black[60];
    this.context.globalAlpha = 1;
    this.context.fillRect(0, 0, this.canvas.width, this.sizes.fontSize + 4);
    this.context.fillStyle = COLORS.debugLabel;
    this.context.fillText(`${Math.round(value)} ${this.name} (${Math.round(this.minValue)} - ${Math.round(this.maxValue)})`, 
    this.sizes.title.xPos, this.sizes.title.yPos);
  }

  private drawGraph(value: number) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    this.context.drawImage(
      this.canvas, 
      this.sizes.graph.xPos + devicePixelRatio, 
      this.sizes.graph.yPos, 
      this.sizes.graph.width - devicePixelRatio, 
      this.sizes.graph.height,
      this.sizes.graph.xPos,
      this.sizes.graph.yPos,
      this.sizes.graph.width - devicePixelRatio,
      this.sizes.graph.height
    );

    this.context.fillRect(
      this.sizes.graph.xPos + this.sizes.graph.width - devicePixelRatio, 
      this.sizes.graph.yPos, 
      devicePixelRatio, 
      this.sizes.graph.height,
    );

    this.context.fillStyle = COLORS.black[100];
    this.context.fillRect(
      this.sizes.graph.xPos + this.sizes.graph.width - devicePixelRatio,
      this.sizes.graph.yPos,
      devicePixelRatio,
      Math.round((1 - (value / this.maxValue)) * this.sizes.graph.height)
    );    
  }
  private createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.sizes.canvas.width;
    canvas.height = this.sizes.canvas.height;
    canvas.style.cssText = 'width80px;height:48px';
    return canvas;
  }

  private getSizes() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvas = {
      width: 100 * devicePixelRatio,
      height: 48 * devicePixelRatio,
    }

    const fontSize = 10 * devicePixelRatio;

    const title = {
      xPos: 3 * devicePixelRatio,
      yPos: 2 * devicePixelRatio
    };
    
    const graph = {
      xPos: 3 * devicePixelRatio,
      yPos: 15 * devicePixelRatio,
      width: 94 * devicePixelRatio,
      height: 30 * devicePixelRatio
    };

    return { 
      canvas,
      title,
      graph,
      fontSize
    }
  }
}