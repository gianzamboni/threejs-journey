/// <reference types="vite/client" />
import '../pollyfills/symbol-pollyfill';
import DebugUI from "#/app/layout/debug-ui";
import { InfoBox } from "#/app/layout/info-box";
import { LoadingScreen } from "#/app/layout/loading-screen";
import Menu from "#/app/layout/menu";
import { Quality, qualityFromString, QualitySelector } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { ErrorData, WarningBox } from "#/app/layout/warning-box";
import { Exercise, ExerciseClass } from '#/app/types/exercise';
import { AssetLoader, LoadingData } from "#/app/utils/assets-loader";
import { ActionBar } from './app/layout/action-bar';
import { isInDevMode } from './app/utils';
import { getId, isDebuggable } from './app/utils/exercise-metadata';
import { pascalCaseToText } from './app/utils/text-utils';
import { CSS_CLASSES } from './theme';


let tappedTwice = false;

const loader: AssetLoader = AssetLoader.getInstance();
let activeExercise: Exercise;
let activeQuality: Quality;

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let debugUI: DebugUI;
let loadingScreen: LoadingScreen;
let warningBox: WarningBox;
let qualitySelector: QualitySelector;
let actionBar: ActionBar;

function updateDebugUI(evt: CustomEvent): void {
  debugUI.update(evt.detail);
}

function toggleDebug(event?: MouseEvent) {
  if(event !== undefined) {
    event.preventDefault();
    event.stopPropagation();
  }
  debugUI.toggle(activeExercise);
}

function doubleTapHandler() {
  if(!tappedTwice) {
    tappedTwice = true;
    setTimeout(() => {
      tappedTwice = false;
    }, 300);
    return false;
  }
}

function showLoadingScreen() {
  loadingScreen.show();
}

function updateLoadingScreen(evt: CustomEvent<LoadingData>) {
  loadingScreen.update(evt.detail);
}

function hideLoadingScreen() {
  loadingScreen.hide();
}

function showErrorMessage(evt: CustomEvent<ErrorData>) {
  warningBox.setMessage(evt.detail);
}

function updateURL(exercise: Exercise) { 
  const id = getId(exercise);
  window.history.pushState({exerciseId: id}, '', `?exercise=${id}&quality=${activeQuality}`);
  document.title = `${pascalCaseToText(id)} | Three.js Journey`;
}

async function selectExercise(newExercise: ExerciseClass) {
  if(activeExercise !== undefined) {
    activeExercise.removeEventListener('debug-info', updateDebugUI as EventListener);
    debugUI.reset();
    loader.reset();
    actionBar.reset();
    infoBox.close();
    await activeExercise.dispose();
  }

  activeExercise = new newExercise(renderView, activeQuality);
  updateURL(activeExercise);
  debugUI.createControllers(activeExercise);
  infoBox.updateContent(activeExercise);
  renderView.run(activeExercise);
  actionBar.updateContent(activeExercise);
  if(isDebuggable(activeExercise) && isInDevMode()) {
    activeExercise.addEventListener('debug-info',  updateDebugUI as EventListener);
  }
  toggleDebug();
}

function changeQuality(evt: CustomEvent<string>) {
  activeQuality = qualityFromString(evt.detail);
  selectExercise(activeExercise?.constructor as ExerciseClass);
}

function setupListeners() {
  menu.addEventListener('exercise-selected', async (event: CustomEventInit) => {
    selectExercise(event.detail);
  });

  loader.addEventListener('loading-started', showLoadingScreen as EventListener);
  loader.addEventListener('loading-progress', updateLoadingScreen as EventListener);
  loader.addEventListener('loading-complete', hideLoadingScreen); 
  loader.addEventListener('loading-error', showErrorMessage as EventListener);
  window.addEventListener('resize', () => {
    renderView.updateSize();
  });
  
  renderView.canvas.addEventListener('dblclick', toggleDebug);

  window.addEventListener('touch', () => {
    doubleTapHandler();
    if(tappedTwice) {
      toggleDebug();
    }
  });

  qualitySelector.addEventListener('quality-changed', changeQuality as EventListener);

}

function initAllGUIParts() {
  menu = new Menu(document.body);
  renderView = new RenderView(document.body);
  const rightColumn = document.createElement('div');
  rightColumn.id = "right-column";
  rightColumn.className = `fixed top-0 right-5 m-5 flex flex-col items-end gap-2 ${CSS_CLASSES.main_layout_index}`;
  qualitySelector = new QualitySelector(rightColumn, activeQuality);
  
  debugUI = new DebugUI(rightColumn);
  document.body.appendChild(rightColumn);

  loadingScreen = new LoadingScreen(document.body);
  
  const bottomRow = document.createElement('div');
  bottomRow.id = "bottom-row";
  bottomRow.className = `fixed bottom-0 left-0 flex flex-col md:flex-row items-end justify-between align-center ${CSS_CLASSES.main_layout_index}`;

  infoBox = new InfoBox(bottomRow);
  warningBox = new WarningBox(bottomRow);
  document.body.appendChild(bottomRow);

  actionBar = new ActionBar();

}

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const quality = urlParams.get('quality');
  activeQuality = qualityFromString(quality);

  initAllGUIParts();
  setupListeners();

  if(exerciseId !== null) {
    menu.selectExercise(exerciseId);
  } else {
    menu.selectLastExercise();
  }
});
