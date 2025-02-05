export class DebugableExercise {
  
  constructor(exercise, debugUI, view) {
    this.exercise = new exercise(view, debugUI);
    this.debugUI = debugUI;
    this.view = view;
    this.sendDebugData = false;
    this.debugUI.enable();
  }

  get scene() {
    return this.exercise.scene;
  }

  init() {
    this.debugUI.register('FPS', {
      updateType: "mean"
    })
    
    this.exercise.init(this.debugUI);
    this.view.setTick(this.animation.bind(this));
  }

  animation(timer) {
    if(this.exercise.animation) {
      this.exercise.animation(timer);
    }
    if(this.sendDebugData) {
      this.debugUI.update('FPS', 1/timer.getDelta()); 
    }
  }

  toggleDebugUI() {
    this.sendDebugData = !this.sendDebugData;
    this.debugUI.toggle();
  }

  dispose() {
    this.exercise.dispose();
    this.debugUI.reset();
  }

  scroll(value) {
    if(this.exercise.scroll) {
      this.exercise.scroll(value);
    }
  }

  mouseMove(x, y) {
    if(this.exercise.mouseMove) {
      this.exercise.mouseMove(x, y);
    }
  }
}