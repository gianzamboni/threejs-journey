import { ActionBar } from '#/app/layout/action-bar';
import DebugUI from "#/app/layout/debug-ui";
import { InfoBox } from "#/app/layout/info-box";
import { LoadingScreen } from "#/app/layout/loading-screen";
import Menu from "#/app/layout/menu";
import { Quality, qualityFromString, QualitySelector } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { ErrorData, WarningBox } from "#/app/layout/warning-box";
import { Exercise, ExerciseClass } from '#/app/types/exercise';
import { isInDevMode } from '#/app/utils';
import { AssetLoader, LoadingData } from "#/app/utils/assets-loader";
import { getId, isDebuggable } from '#/app/utils/exercise-metadata';
import { pascalCaseToText } from '#/app/utils/text-utils';
import { CSS_CLASSES } from '#/theme';

export class App {
  private tappedTwice = false;
  private loader = AssetLoader.getInstance();
  private activeExercise!: Exercise;
  private activeQuality!: Quality;

  private menu: Menu;
  private infoBox: InfoBox;
  private renderView: RenderView;
  private debugUI!: DebugUI;
  private loadingScreen!: LoadingScreen;
  private warningBox!: WarningBox;
  private qualitySelector!: QualitySelector;
  private actionBar!: ActionBar;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    const quality = urlParams.get('quality');
    this.activeQuality = qualityFromString(quality);

    this.menu = new Menu();
    this.infoBox = new InfoBox();
    this.renderView = new RenderView();
  }

  init() {
    this.initAllGUIParts();
    this.setupListeners();

    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = urlParams.get('exercise');

    if(exerciseId !== null) {
      this.menu.selectExercise(exerciseId);
    } else {
      this.menu.selectLastExercise();
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
      this.infoBox.close();
      await this.activeExercise.dispose();
    }

    this.activeExercise = new newExercise(this.renderView, this.activeQuality);
    this.updateURL(this.activeExercise);
    this.debugUI.createControllers(this.activeExercise);
    this.infoBox.updateContent(this.activeExercise);
    this.renderView.run(this.activeExercise);
    this.actionBar.updateContent(this.activeExercise);
    if(isDebuggable(this.activeExercise) && isInDevMode()) {
      this.activeExercise.addEventListener('debug-info', this.updateDebugUI.bind(this) as EventListener);
    }
    this.toggleDebug();
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
    
    window.addEventListener('resize', () => {
      this.renderView.updateSize();
    });
    
    this.renderView.canvas.addEventListener('dblclick', this.toggleDebug.bind(this));

    window.addEventListener('touch', () => {
      this.doubleTapHandler();
      if(this.tappedTwice) {
        this.toggleDebug();
      }
    });

    this.qualitySelector.addEventListener('quality-changed', this.changeQuality.bind(this) as EventListener);
  }

  private initAllGUIParts() {
    const bottomRow = document.createElement('div');
    bottomRow.id = "bottom-row";
    bottomRow.className = `fixed bottom-0 left-0 flex flex-col md:flex-row items-end justify-between align-center ${CSS_CLASSES.main_layout_index}`;

    this.infoBox.addTo(bottomRow);


    document.body.appendChild(bottomRow);
    this.menu.addTo(document.body);
    this.renderView.addTo(document.body);

    
    const rightColumn = document.createElement('div');
    rightColumn.id = "right-column";
    rightColumn.className = `fixed top-0 right-5 m-5 flex flex-col items-end gap-2 ${CSS_CLASSES.main_layout_index}`;
    this.qualitySelector = new QualitySelector(rightColumn, this.activeQuality);
    
    this.debugUI = new DebugUI(rightColumn);
    document.body.appendChild(rightColumn);

    this.loadingScreen = new LoadingScreen(document.body);
    

    this.warningBox = new WarningBox(bottomRow);

    this.actionBar = new ActionBar();
  }
}

