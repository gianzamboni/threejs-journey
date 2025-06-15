import { ActionBar } from '#/app/layout/action-bar';
import DebugUI from "#/app/layout/debug-ui";
import { InfoBox } from "#/app/layout/info-box";
import { LoadingScreen } from "#/app/layout/loading-screen";
import Menu from "#/app/layout/menu";
import { Quality, qualityFromString, QualitySelector } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { ErrorData, WarningBox } from "#/app/layout/warning-box";
import { AssetLoader, LoadingData } from "#/app/services/assets-loader";
import { Exercise, ExerciseClass } from '#/app/types/exercise';
import { isInDevMode } from '#/app/utils';
import { getId, isDebuggable } from '#/app/utils/exercise-metadata';
import { pascalCaseToText } from '#/app/utils/text-utils';
import { CSS_CLASSES } from '#/theme';

export class App {
  private tappedTwice = false;
  private loader = AssetLoader.getInstance();
  private activeExercise!: Exercise;
  private activeQuality!: Quality;

  private layoutContainer: HTMLDivElement;
  private menu: Menu;
  private infoBox: InfoBox;
  private renderView: RenderView;
  private debugUI: DebugUI;
  private loadingScreen: LoadingScreen;
  private warningBox: WarningBox;
  private qualitySelector: QualitySelector;
  private actionBar: ActionBar;

  constructor(quality: Quality) {
    this.activeQuality = qualityFromString(quality);
    this.layoutContainer = document.createElement('div');
    this.layoutContainer.id = 'layout-container';
    this.layoutContainer.className = 'w-100 h-100';
    document.body.appendChild(this.layoutContainer);

    this.menu = new Menu();
    this.infoBox = new InfoBox();
    this.renderView = new RenderView();
    this.debugUI = new DebugUI();
    this.qualitySelector = new QualitySelector(this.activeQuality);
    this.loadingScreen = new LoadingScreen();
    this.warningBox = new WarningBox();
    this.actionBar = new ActionBar();
  }

  init() {
    this.addToDOM();
    this.setupListeners();

    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('exercise');

    if(exerciseId !== null) {
      this.menu.selectExercise(exerciseId);
    } else {
      this.menu.selectFirstExercise();
    }
  }

  private updateDebugUI(evt: CustomEvent): void {
    this.debugUI.update(evt.detail);
  }

  private toggleDebug(event?: MouseEvent) {
    if(event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.debugUI.toggle(this.activeExercise);
  }

  private doubleTapHandler() {
    if(!this.tappedTwice) {
      this.tappedTwice = true;
      setTimeout(() => {
        this.tappedTwice = false;
      }, 300);
      return false;
    }
  }

  private showLoadingScreen() {
    this.loadingScreen.show();
  }

  private updateLoadingScreen(evt: CustomEvent<LoadingData>) {
    this.loadingScreen.update(evt.detail);
  }

  private hideLoadingScreen() {
    this.loadingScreen.hide();
  }

  private showErrorMessage(evt: CustomEvent<ErrorData>) {
    this.warningBox.setMessage(evt.detail);
  }

  private updateURL(exercise: Exercise) { 
    const id = getId(exercise);
    window.history.pushState({exerciseId: id}, '', `?exercise=${id}&quality=${this.activeQuality}`);
    document.title = `${pascalCaseToText(id)} | Three.js Journey`;
  }

  async selectExercise(newExercise: ExerciseClass) {
    if(this.activeExercise !== undefined) {
      this.activeExercise.removeEventListener('debug-info', this.updateDebugUI as EventListener);
      this.debugUI.reset();
      this.loader.reset();
      this.actionBar.reset();
      this.renderView.reset();
      this.infoBox.close();
      await this.activeExercise.dispose();
    }

    this.activeExercise = new newExercise(this.renderView, {
      quality: this.activeQuality,
      layoutComponents: { 
        actionBar: this.actionBar
      }
    });
    this.updateURL(this.activeExercise);
    this.debugUI.createControllers(this.activeExercise);
    this.infoBox.updateContent(this.activeExercise);
    this.renderView.run(this.activeExercise);
    this.actionBar.updateContent(this.activeExercise);
    if(isDebuggable(this.activeExercise) && isInDevMode()) {
      this.activeExercise.addEventListener('debug-info', this.updateDebugUI.bind(this) as EventListener);
      this.toggleDebug();
    }
  }

  private changeQuality(evt: CustomEvent<string>) {
    this.activeQuality = qualityFromString(evt.detail);
    this.selectExercise(this.activeExercise?.constructor as ExerciseClass);
  }

  private setupListeners() {
    this.menu.addEventListener('exercise-selected', async (event: CustomEventInit) => {
      this.selectExercise(event.detail);
    });

    this.loader.addEventListener('loading-started', this.showLoadingScreen.bind(this) as EventListener);
    this.loader.addEventListener('loading-progress', this.updateLoadingScreen.bind(this) as EventListener);
    this.loader.addEventListener('loading-complete', this.hideLoadingScreen.bind(this)); 
    this.loader.addEventListener('loading-error', this.showErrorMessage.bind(this) as EventListener);
    
    this.renderView.canvas.addEventListener('dblclick', this.toggleDebug.bind(this));

    window.addEventListener('touch', () => {
      this.doubleTapHandler();
      if(this.tappedTwice) {
        this.toggleDebug();
      }
    });

    this.qualitySelector.addEventListener('quality-changed', this.changeQuality.bind(this) as EventListener);
    
    window.addEventListener('keydown', (event) => {
      if(event.code === 'KeyH') {
        this.toggleLayout();
      }
    });
  
  }

  private toggleLayout() {
    this.layoutContainer.classList.toggle('hidden');
    }

  private addToDOM() {
    const rowClasses = `${CSS_CLASSES.main_layout_index} fixed flex flex-col items-end`
    const bottomRow = document.createElement('div');
    bottomRow.id = "bottom-row";
    bottomRow.className = `${rowClasses} bottom-0 left-0 md:flex-row justify-between align-center w-full px-5`;

    const rightColumn = document.createElement('div');
    rightColumn.id = "right-column";
    rightColumn.className = `${rowClasses} top-0 right-5 m-5 gap-2`;

    this.actionBar.addTo(this.infoBox.container);

    this.infoBox.addTo(bottomRow);
    this.warningBox.addTo(bottomRow);
    document.body.appendChild(bottomRow);

    this.qualitySelector.addTo(rightColumn);
    this.debugUI.addTo(rightColumn);
    this.layoutContainer.appendChild(rightColumn);

    this.menu.addTo(this.layoutContainer);
    this.renderView.addTo(document.body);
    this.loadingScreen.addTo(document.body);
  }

}

