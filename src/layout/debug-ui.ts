export default class DebugUI {
  
  private container: HTMLDivElement;
  private lastGuiUpdate: number;
  private dataRows: Record<string, HTMLElement> = {};

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
    if(now - this.lastGuiUpdate > 150) {
      Object.keys(info).forEach(key => {
        const dataRow = this.getDataRow(key);
        dataRow.innerText = info[key];
      });
    }
  }

  private getDataRow(key: string) {
    if(this.dataRows[key] === undefined) {
      const row = document.createElement('div');
      row.className = `flex justify-between items-center p-2 gap-2`;
      const label = document.createElement('div');
      label.className = `text-sm text-red-600`;
      label.innerText = `${key.toUpperCase()}:`;
      const value = document.createElement('div');
      value.className = `text-sm`;
      row.appendChild(label);
      row.appendChild(value);
      this.container.appendChild(row);
      this.dataRows[key] = value;
    }

    return this.dataRows[key];
  }
}