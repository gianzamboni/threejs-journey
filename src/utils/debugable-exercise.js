export class DebugableExercise {
  
  constructor(exercise, debugUI, view) {
    this.exercise = exercise;
    this.debugUI = debugUI;
    this.view = view;

    this.debugUI.register('FPS', {
      type: "mean"
    })

    this.sendDebugData = false;
    this.debugUI.enable();
  }

  get scene() {
    return this.exercise.scene;
  }

  init() {
    this.exercise.init();
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
    this.sendDebugData = true;
    this.debugShouldShow = true;
    this.debugUI.toggle();
  }

  dispose() {
    this.exercise.dispose();
    this.debugUI.reset();
  }
}