import { journey } from "./journey";

export class StateManager extends EventTarget {
  constructor() {
    super();
    this.activeSection = null
    this.activeExercise = null;
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    const exercise = urlParams.get('exercise');

    if (section && exercise) {
      this.activeSection = section;
      this.activeExercise = exercise;
    } else {
      const lastSection = journey[journey.length - 1];
      this.activeSection = lastSection.id;

      const lastExercise = lastSection.exercises[lastSection.exercises.length - 1];
      this.activeExercise = lastExercise.id;
    }

    this.dispatchEvent(new CustomEvent('exercise-changed', { detail: { 
      section: this.activeSection, exercise: this.activeExercise 
    }}));

  }
}