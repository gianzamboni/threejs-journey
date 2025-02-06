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
    

    this.context.fillStyle = COLORS.white;
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
    this.context.fillStyle = COLORS.white;
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

    this.context.fillStyle = COLORS.black[90];
    //this.context.globalAlpha = 0.9;
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



// Stats.Panel = function (name, fg, bg) {

//   var min = Infinity, max = 0, round = Math.round;
//   var PR = round(window.devicePixelRatio || 1);

//   var WIDTH = 80 * PR, HEIGHT = 48 * PR,
//     TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
//     GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
//     GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

//   var canvas = document.createElement('canvas');
//   canvas.width = WIDTH;
//   canvas.height = HEIGHT;
//   canvas.style.cssText = 'width:80px;height:48px';

//   var context = canvas.getContext('2d');
//   context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
//   context.textBaseline = 'top';

//   context.fillStyle = bg;
//   context.fillRect(0, 0, WIDTH, HEIGHT);

//   context.fillStyle = fg;
//   context.fillText(name, TEXT_X, TEXT_Y);
//   context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

//   context.fillStyle = bg;
//   context.globalAlpha = 0.9;
//   context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

//   return {

//     dom: canvas,

//     update: function (value, maxValue) {

//       context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

//       context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

//       context.fillStyle = bg;
//       context.globalAlpha = 0.9;
//       context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));

//     }

//   };

// };