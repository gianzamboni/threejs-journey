import Menu from "@/layout/menu";
import { InfoBox } from "./layout/info-box";
import RenderView from "./layout/render-view";
import { Exercise, ExerciseClass } from "./journey/types";
import DebugUI from "./layout/debug-ui";

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let debugUI: DebugUI;
let activeExercise: Exercise | undefined;

function updateDebugUI(evt: CustomEvent): void {
  debugUI.update(evt.detail);
}

function toggleDebug() {
  if(activeExercise?.isDebuggable === true) {
    activeExercise!.toggleDebug!();
    debugUI.toggle();
  } 
}

async function selectExercise(newExercise: ExerciseClass) {
  infoBox.updateContent(newExercise);
  if(activeExercise !== undefined) {
    activeExercise.removeEventListener('debug-info', updateDebugUI as EventListener);
    debugUI.reset();
    await activeExercise.dispose();
  }
  
  window.history.pushState({exerciseId: newExercise.id}, '', `?exercise=${newExercise.id}`);
  activeExercise = new (newExercise as any)() as Exercise;

  activeExercise.addEventListener('debug-info',  updateDebugUI as EventListener);

  renderView.run(activeExercise);

  console.log(import.meta.env)
  if(activeExercise.isDebuggable && import.meta.env.MODE === 'development') {
    toggleDebug();
  }
}

window.addEventListener('load', () => {
  menu = new Menu(document.body);
  infoBox = new InfoBox(document.body);
  renderView = new RenderView(document.body);
  debugUI = new DebugUI(document.body);

  menu.addEventListener('exercise-selected', async (event: CustomEventInit) => {
    selectExercise(event.detail);
  });

  window.addEventListener('resize', () => {
    renderView.updateSize();
  });
  
  window.addEventListener('dblclick', toggleDebug);
  
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');

  if(exerciseId !== null) {
    menu.selectExercise(exerciseId);
  } else {
    menu.selectLastExercise();
  }
});
