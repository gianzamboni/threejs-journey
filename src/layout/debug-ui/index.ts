import GUI from "lil-gui";
import { GraphPanel } from "./graph-panel";

type DataRow = GraphPanel;

export default class DebugUI {
  
  private container: HTMLDivElement;
  private lastGuiUpdate: number;

  private dataRows: Record<string, DataRow> = {};

  private lilGui: GUI | null = null;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = `fixed top-0 right-0 text-white m-5 justify-items-end
`;
    this.container.innerHTML = ``;
    parent.appendChild(this.container);
    this.lastGuiUpdate = performance.now();
    this.toggle();
  }

  toggle() {
    this.lastGuiUpdate = performance.now();
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

  get gui() {
    if(this.lilGui === null) {
      this.lilGui = new GUI({
        title: 'Settings',
        closeFolders: false,
        container: this.container
      });
    }
    return this.lilGui;
  }

  reset() {
    this.container.classList.add('hidden');
    Object.entries(this.dataRows).forEach(([_, dataRow]) => {
      dataRow.dispose();
    });
    this.dataRows = {};
    this.lilGui?.destroy();
    this.lilGui = null;
  }
}