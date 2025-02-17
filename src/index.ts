/// <reference types="vite/client" />

import Menu from "@/app/layout/menu";
import { InfoBox } from "./app/layout/info-box";
import RenderView from "./app/layout/render-view";
import DebugUI from "./app/layout/debug-ui";
import BaseExercise from "./app/journey/exercises/base-exercise";
import { AssetLoader, LoadingData } from "./app/utils/assets-loader";
import { LoadingScreen } from "./app/layout/loading-screen";
import { ErrorData, WarningBox } from "./app/layout/warning-box";
import { Quality, qualityFromString, QualitySelector } from "./app/layout/quality-selector";
import { ExerciseClass } from "./app/journey/types";

let tappedTwice = false;

const loader: AssetLoader = AssetLoader.getInstance();
let activeExercise: BaseExercise | undefined;
let activeQuality: Quality;

let menu: Menu;
let infoBox: InfoBox;
let renderView: RenderView;
let debugUI: DebugUI;
let loadingScreen: LoadingScreen;
let warningBox: WarningBox;
let qualitySelector: QualitySelector;

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

async function selectExercise(newExercise: ExerciseClass) {
  if(activeExercise !== undefined) {
    activeExercise.removeEventListener('debug-info', updateDebugUI as EventListener);
    debugUI.reset();
    loader.reset();
    await activeExercise.dispose();
  }
  
  window.history.pushState({exerciseId: newExercise.id}, '', `?exercise=${newExercise.id}&quality=${activeQuality}`);
  activeExercise = new newExercise(renderView, activeQuality, debugUI);

  activeExercise.addEventListener('debug-info',  updateDebugUI as EventListener);

  infoBox.updateContent(activeExercise);
  renderView.run(activeExercise);
  if(activeExercise.isDebuggable && import.meta.env.MODE === 'development') {
    toggleDebug();
  }
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
  rightColumn.className = "fixed top-0 right-0 m-5 flex flex-col items-end gap-2";
  qualitySelector = new QualitySelector(rightColumn, activeQuality);
  debugUI = new DebugUI(rightColumn);
  document.body.appendChild(rightColumn);

  loadingScreen = new LoadingScreen(document.body);
  
  const bottomRow = document.createElement('div');
  bottomRow.id = "bottom-row";
  bottomRow.className = "fixed bottom-0 left-0 w-full flex flex-col md:flex-row items-end justify-between align-center";

  infoBox = new InfoBox(bottomRow);
  warningBox = new WarningBox(bottomRow);
  document.body.appendChild(bottomRow);
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
