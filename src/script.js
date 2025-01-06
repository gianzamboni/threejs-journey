import { BasicView } from './app/basic-view.js';
import { Menu } from './app/menu.js';
import { HelpBox } from './app/help-box.js';
import { journey } from './app/journey.js';
import { DebugUI } from './app/debug-ui.js';
import { DebugableExercise } from './utils/debugable-exercise.js';

Array.prototype.last = function() { return this[this.length - 1] };

class App {
  constructor(journey) {
    this.activeExercise = journey.last().exercises.last();
    this.exerciseInstance = null;
    this.helpBox = new HelpBox();
    this.view = new BasicView();
    this.debugUI = new DebugUI();
    this.menu = new Menu(journey, this.activeExercise.id);
    this.menu.addEventListener('select', (event) => {
      this.execute(event.detail);
    });
  };

  async execute(exercise) {
    await this.stopCurrentExercise();
    history.pushState(exercise.id, "", exercise.id);
    document.title = `${exercise.title} - Three.js Journey`;
    this.menu.deselectExercise(this.activeExercise.id);
    this.activeExercise = exercise;

    if(exercise.config.debugable) {
      this.exerciseInstance = new DebugableExercise(exercise.class, this.debugUI, this.view);
    } else {
      this.exerciseInstance = new exercise.class(this.view);
    }

    this.menu.selectExercise(exercise.id);
    await this.view.run(exercise, this.exerciseInstance);
    this.helpBox.show(exercise);
  };

  init(exerciseId) {
    const exercise = exerciseId !== "" ? this.findExercise(exerciseId) : this.activeExercise;
    this.execute(exercise);
  };

  findExercise(id) {
    return journey.map((chapter) => chapter.exercises).flat().find((exercise) => exercise.id === id);
  }

  updateViewSize() {
    this.view.updateSize();
  }

  toggleDebugUI() {
    if(this.activeExercise.config.debugable) {
      this.exerciseInstance.toggleDebugUI();
    }
  }

  async stopCurrentExercise() {
    await this.view.stop();
    if(this.exerciseInstance) {
      await this.exerciseInstance.dispose();
    }
  }
}

let app = null;
window.addEventListener('load', () => {
  const url = new URL(window.location.href);
  const exercise = url.pathname.split('/').last();
  app = new App(journey);
  app.init(exercise);
});

window.addEventListener('popstate', (event) => {
  const exercise = app.findExercise(event.state);
  app.execute(exercise);
})

window.addEventListener('resize', (event) => {
  app.updateViewSize();
})

window.addEventListener('dblclick', (event) => {
  app.toggleDebugUI();
})
