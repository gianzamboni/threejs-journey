import GUI from "lil-gui";

import { ControllerFactory } from "#/app/layout/debug-ui/controller-factory";
import { GraphPanel } from "#/app/layout/debug-ui/graph-panel";
import { Exercise } from "#/app/types/exercise";
import { hasControllers, isDebuggable, getMetadata } from "#/app/utils/exercise-metadata";

type DataRow = GraphPanel;

export default class DebugUI {
  
  private container: HTMLDivElement;
  private lastGuiUpdate: number;

  private dataRows: Record<string, DataRow> = {};

  private lilGui: GUI | null = null;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = `text-white justify-items-end hidden`;
    this.container.innerHTML = ``;
    this.lastGuiUpdate = performance.now();
  }

  addTo(parent: HTMLElement) {
    parent.appendChild(this.container);
  }

  toggle(activeExercise: Exercise) {
    if(!isDebuggable(activeExercise)) {
      return;
    }
    this.lastGuiUpdate = performance.now();
    this.container.classList.toggle('hidden');
    const metadata = getMetadata(activeExercise);
    metadata.shouldSendData = !this.container.classList.contains('hidden');
  }

  update(info: Record<string, number>) {
    const now = performance.now();
    if(now - this.lastGuiUpdate > 1000) {
      for(const key of Object.keys(info)) {
        const dataRow = this.getDataRow(key);
        dataRow.update(info[key]);
      }
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
        closeFolders: true,
        container: this.container
      });
    }
    return this.lilGui;
  }

  reset() {
    this.container.classList.add('hidden');
    for(const key in this.dataRows) {
      this.dataRows[key].dispose();
    }
    this.dataRows = {};
    const controllers = this.gui.controllersRecursive() ?? [];
    for(const controller of controllers) {
      controller.destroy();
    }
    this.lilGui?.destroy();
    this.lilGui = null;
  }

  public createControllers(exercise: Exercise) {
    if(hasControllers(exercise)) {
      const gui = this.gui;
      const controllerFactory = new ControllerFactory(gui, exercise);
      controllerFactory.create();
    }
  }
}