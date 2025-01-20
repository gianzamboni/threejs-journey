import { COLORS } from "@/theme";

export class GraphPanel {
  
  private canvas: HTMLCanvasElement;
  constructor(name: string, parent: HTMLElement) {
    const pixelRatio = Math.round(window.devicePixelRatio || 1);
    const width = 80 //* pixelRatio;
    const height = 48 //* pixelRatio;
    const textX = 3 * pixelRatio;
    const textY = 2 * pixelRatio;  
    const graphX = 3 * pixelRatio;
    const graphY = 15 * pixelRatio;
    const graphWidth = 74 * pixelRatio;
    const graphHeight = 30 * pixelRatio;
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.cssText = 'width:80px;height:48px';

    const context = this.canvas.getContext('2d');
    if(context === null) {
      throw new Error('Unable to get canvas context');
    }
    context.font = 'bold ' + (5 * pixelRatio) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = COLORS.blackAlpha;
    context.fillRect(0, 0, width, height);

    context.fillStyle = COLORS.debugLabel;
    context.fillText(name, textX, textY);
    context.fillRect(graphX, graphY, graphWidth, graphHeight);

    const bg = COLORS.blackAlpha;
    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(graphX, graphY, graphWidth, graphHeight);

    parent.appendChild(this.canvas);
  }

  
  update(value: number) {
    console.log(value);
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

//       min = Math.min(min, value);
//       max = Math.max(max, value);

//       context.fillStyle = bg;
//       context.globalAlpha = 1;
//       context.fillRect(0, 0, WIDTH, GRAPH_Y);
//       context.fillStyle = fg;
//       context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

//       context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

//       context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

//       context.fillStyle = bg;
//       context.globalAlpha = 0.9;
//       context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));

//     }

//   };

// };