export class HelpBox {
  constructor() {
    this.content = document.getElementById('help-box-content');
    this.title = document.getElementById('help-box-title');

    this.exerciseHelp = document.getElementById('help-box-exercise-help');
    this.orbitControlHelp = document.getElementById('help-box-orbit-controls-help');
    this.deubgUIHelp = document.getElementById('help-box-debug-ui-help');

    this.orbitControlHelp.classList.add('hidden');
    this.exerciseHelp.classList.add('hidden');
    this.deubgUIHelp.classList.add('hidden');
    this.content.classList.add('hidden');

  }

  show(exercise) {
    this.title.innerHTML = exercise.title;
    if(exercise.help) {
      this.exerciseHelp.innerHTML = exercise.help;
      this.content.classList.remove('hidden');
    }
    console.log(exercise)
    if(exercise.config.enableOrbitControls) {
      this.orbitControlHelp.classList.remove('hidden');
      this.content.classList.remove('hidden');
    }
  }
}