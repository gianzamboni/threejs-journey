/// <reference types="vite/client" />

import Menu from "@/app/layout/menu";
import { InfoBox } from "./app/layout/info-box";
import RenderView from "./app/layout/render-view";
import DebugUI from "./app/layout/debug-ui";
import BaseExercise from "./app/journey/exercises/base-exercise";
import { ExerciseClass } from "./app/journey/types";
import { AssetLoader, LoadingData } from "./app/utils/assets-loader";
import { LoadingScreen } from "./app/layout/loading-screen";

let tappedTwice = false;

let loader: AssetLoader = AssetLoader.getInstance();
let activeExercise: BaseExercise | undefined;

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let debugUI: DebugUI;
let loadingScreen: LoadingScreen;


function updateDebugUI(evt: CustomEvent): void {
  debugUI.update(evt.detail);
}

function toggleDebug(event?: MouseEvent) {
  if(event !== undefined) {
    event.preventDefault();
    event.stopPropagation();
  }
  if(activeExercise?.isDebuggable === true) {
    activeExercise.toggleDebug();
    debugUI.toggle();
  } 
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

function showLoadingScreen(evt: CustomEvent<LoadingData>) {
  loadingScreen.show(evt.detail);
}

function updateLoadingScreen(evt: CustomEvent<LoadingData>) {
  loadingScreen.update(evt.detail);
}

function hideLoadingScreen() {
  loadingScreen.hide();
}

async function selectExercise(newExercise: ExerciseClass) {
  if(activeExercise !== undefined) {
    activeExercise.removeEventListener('debug-info', updateDebugUI as EventListener);
    debugUI.reset();
    loader.reset();
    await activeExercise.dispose();
  }
  
  window.history.pushState({exerciseId: newExercise.id}, '', `?exercise=${newExercise.id}`);
  activeExercise = new newExercise(renderView, debugUI);

  activeExercise.addEventListener('debug-info',  updateDebugUI as EventListener);

  infoBox.updateContent(activeExercise);
  renderView.run(activeExercise);
  if(activeExercise.isDebuggable && import.meta.env.MODE === 'development') {
    toggleDebug();
  }
}

window.addEventListener('load', () => {
  menu = new Menu(document.body);
  infoBox = new InfoBox(document.body);
  renderView = new RenderView(document.body);
  debugUI = new DebugUI(document.body);
  loadingScreen = new LoadingScreen(document.body);

  menu.addEventListener('exercise-selected', async (event: CustomEventInit) => {
    selectExercise(event.detail);
  });

  loader.addEventListener('loading-started', showLoadingScreen as EventListener);
  loader.addEventListener('loading-progress', updateLoadingScreen as EventListener);
  loader.addEventListener('loading-complete', hideLoadingScreen); 

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

  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');

  if(exerciseId !== null) {
    menu.selectExercise(exerciseId);
  } else {
    menu.selectLastExercise();
  }
});
