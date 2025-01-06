export class DebugUI {
  constructor() {
    this.container = document.getElementById("debug-ui-control-box");
    this.lilGuiContainer = document.getElementById("lil-gui-container");
    this.debugDataContainer = document.getElementById("debug-data");

    if(process.env.NODE_ENV !== "development") {
      this.container.style.display = "none";
    }

    this.shouldShow = false;
    this.isShown = false;
    this.info = {};
    this.currentExercise = null;
    this.lastGUIUpdate = performance.now();
  }

  reset() {
    this.hide();
    this.shouldShow = false;
    Object.keys(this.info).forEach((key) => {
      this.info[key].row.remove();
    });
    this.info = {};
  }

  toggle() {
    if(this.shouldShow && !this.isShown) {
      this.show();
    } else if(this.isShown) {
      this.hide();
    }
  }

  show() {
    this.container.style.display = "block";
    this.isShown = true;
  }

  hide() {
    this.container.style.display = "none";
    this.isShown = false;
  }

  register(dataLabel, config = {}) {
    const rowData = document.createElement("div");
    rowData.classList.add("debug-data-row");
    
    const labelSpan = document.createElement("span");
    labelSpan.textContent = `${dataLabel}: `;
    rowData.appendChild(labelSpan);

    const valueSpan = document.createElement("span");
    valueSpan.classList.add("debug-data-value");
    valueSpan.textContent = "0";
    rowData.appendChild(valueSpan);

    this.debugDataContainer.appendChild(rowData);
    this.info[dataLabel] = {
      row: rowData,
      element: valueSpan,
      value: 0,
      updateType: config.updateType ?? "replace",
    };

    if(config.updateType === "mean") {
      this.info[dataLabel].samples = 0; 
    }
  }

  update(dataLabel, value) {
    if(this.info[dataLabel].updateType === "mean") {
      this.info[dataLabel].samples++;
      this.info[dataLabel].value = this.info[dataLabel].value  + (value - this.info[dataLabel].value)/this.info[dataLabel].samples;
    } else {
      this.info[dataLabel].value = value;
    }

    this.updateGUI();
  }

  updateGUI() {
    if(performance.now() - this.lastGUIUpdate > 100) {
      Object.keys(this.info).forEach((key) => {
        this.info[key].element.textContent = Math.round(this.info[key].value);
      });
      this.lastGUIUpdate = performance.now();
    }
  }

  enable() {
    this.shouldShow = true;
  }


}