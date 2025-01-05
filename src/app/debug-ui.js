export class DebugUI {
  constructor() {
    this.container = document.getElementById("debug-ui-control-box");
    this.lilGuiContainer = document.getElementById("lil-gui-container");
    this.debugDataContainer = document.getElementById("debug-data");

    this.lilGuiContainer.style.display = "none";
    this.debugDataContainer.style.display = "none";

    this.shouldShow = false;
    this.isShown = false;
    this.info = {};
    this.currentExercise = null;
    this.lastGUIUpdate = performance.now();
  }

  setUp(exerciseData, exerciseInstance) {
    this.debugDataContainer.innerHTML = "";
    this.info = {};
    if(exerciseData.config.debugable) {
      this.shouldShow = true;
      this.currentExercise = exerciseInstance;
    }
  }

  toggle() {
    if(this.shouldShow && !this.isShown) {
      this.show();
    } else if(this.isShown) {
      this.hide();
    }
  }

  show() {
    this.lilGuiContainer.style.display = "block";
    this.debugDataContainer.style.display = "block";
    this.isShown = true;
    this.currentExercise.startDebug(this);
  }

  hide() {
    this.lilGuiContainer.style.display = "none";
    this.debugDataContainer.style.display = "none";
    this.isShown = false;
    this.currentExercise.stopDebug();
  }

  register(dataLabel, config) {
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
      element: valueSpan,
      value: 0,
      updateType: config.updateType ?? "replace"
    };
  }

  update(dataLabel, value) {
    if(this.info[dataLabel].updateType === "mean") {
      this.info[dataLabel].value = (this.info[dataLabel].value + value) / 2;
    } else {
      this.info[dataLabel].value = value;
    }

    const now = performance.now();
    if(now - this.lastGUIUpdate > 500) {
      this.lastGUIUpdate = now;
      this.info[dataLabel].element.textContent = Math.round(this.info[dataLabel].value);
    }
  }
}