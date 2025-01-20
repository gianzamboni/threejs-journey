import { GraphPanel } from "./graph-panel";

type DataRow = GraphPanel;

export default class DebugUI {
  
  private container: HTMLDivElement;
  private lastGuiUpdate: number;

  private dataRows: Record<string, DataRow> = {};

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = `fixed top-0 right-0 bg-alpha-black text-white m-5`;
    this.container.innerHTML = ``;
    parent.appendChild(this.container);
    this.lastGuiUpdate = performance.now();
    if(import.meta.env.MODE === 'production') {
      this.toggle();
    }
  }

  toggle() {
    this.container.classList.toggle('hidden');
  }

  update(info: any) {
    const now = performance.now();
    if(now - this.lastGuiUpdate > 1000) {
      Object.keys(info).forEach(key => {
        const dataRow = this.getDataRow(key);
        dataRow.update(info[key]);
      });
      this.lastGuiUpdate = now;
    }
  }

  private getDataRow(key: string) {
    if (this.dataRows[key] === undefined) {
      switch (key) {
        case 'fps':
          this.dataRows[key] = new GraphPanel('FPS', this.container);
          break;
        default:
          throw new Error(`Unknown key: ${key}`);
      }
    }
    return this.dataRows[key];
  }
}