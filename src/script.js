import { BasicView } from './app/basic-view.js';
import { Menu } from './app/menu.js';
import { journey } from './app/journey.js';

Array.prototype.last = function() { return this[this.length - 1] };

class App {
  constructor(journey) {
    this.activeExercise = journey.last().exercises.last();
    this.view = new BasicView();
    this.menu = new Menu(journey, this.activeExercise.id);
    this.menu.addEventListener('select', (event) => {
      this.execute(event.detail);
    });
  };

  async execute(exercise) {
    history.pushState(exercise.id, "", exercise.id);
    this.menu.deselectExercise(this.activeExercise.id);
    this.activeExercise = exercise;
    this.menu.selectExercise(exercise.id);

    if(this.view.isRunning) {
      await this.view.stop();
    }
    this.view.run(exercise.class);
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
}

const url = new URL(window.location.href);
const exercise = url.pathname.split('/').last();
const app = new App(journey);
app.init(exercise);

window.addEventListener('popstate', (event) => {
  const exercise = app.findExercise(event.state);
  app.execute(exercise);
})

window.addEventListener('resize', (event) => {
  app.updateViewSize();
})