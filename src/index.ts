import Menu from "@/layout/menu";
import { InfoBox } from "./layout/info-box";
import RenderView from "./layout/render-view";
import { Exercise } from "./journey/types";
import DebugUI from "./layout/debug-ui";

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let debugUI: DebugUI;
let activeExercise: Exercise | undefined;

async function selectExercise(newExercise: Exercise) {
  infoBox.updateContent(newExercise);
 
  if(activeExercise !== undefined) {
    await activeExercise.dispose();
  } 
  window.history.pushState({exerciseId: newExercise.id}, '', `?exercise=${newExercise.id}`);
  activeExercise = new (newExercise as any)() as Exercise;

  activeExercise.addEventListener('debug-info', (event: CustomEventInit) => {
    debugUI.update(event.detail);
  });

  renderView.run(activeExercise);
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
  
  window.addEventListener('dblclick', () => {
    if(activeExercise?.isDebuggable === true) {
      activeExercise!.toggleDebug!();
      debugUI.toggle();
    } 
  });
  
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');

  if(exerciseId !== null) {
    menu.selectExercise(exerciseId);
  } else {
    menu.selectLastExercise();
  }
});
