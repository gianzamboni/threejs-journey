import { 
  WebGLRenderer,
  ShadowMapType,
  NoToneMapping,
  PCFShadowMap,
  ToneMapping,
  Color,
  Vector2,
  ColorSpace,
  SRGBColorSpace
} from 'three';

import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { Exercise } from '#/app/types/exercise';
import { isAnimated } from '#/app/utils/exercise-metadata';

type RenderConfig = {
  shadowMapType?: ShadowMapType,
  tone?: {
    mapping?: ToneMapping,
    exposure?: number,
  },
  clearColor?: string,
  outputColorSpace?: ColorSpace,
}

export default class RenderView extends EventTarget {

  public canvas: HTMLElement;
  private _renderer: WebGLRenderer;

  private exercise: Exercise | undefined;

  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'render-view-canvas';
    this.canvas.className = 'fixed top-0 left-0 z-[0]';

    this._renderer = new WebGLRenderer({ 
      canvas: this.canvas,
      antialias: window.devicePixelRatio < 2,
    });

    window.addEventListener('resize', () => {
      this.updateSize();
    });

    this.updateSize();
  }
  
  addTo(parent: HTMLElement) {
    parent.appendChild(this.canvas);
  }

  run(exercise: Exercise) {
    this.exercise = exercise;
    if(isAnimated(exercise)) {
      (this.exercise as AnimatedExercise).startAnimation(this);
    } else {
      this._renderer.render(exercise.scene, exercise.camera);
    }
  }

  update() {
    if(this.exercise === undefined) return;

    this._renderer.render(this.exercise.scene, this.exercise.camera);
  }
  
  updateSize() {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this._renderer.setSize(size.width, size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if(this.exercise) {
      this.exercise.updateCamera(size.width / size.height)
      this._renderer.render(this.exercise.scene, this.exercise.camera);
    }

    this.dispatchEvent(new CustomEvent('resize', { detail: {
      size,
      pixelRatio: this._renderer.getPixelRatio(),
    } }));
  }

  setRender(renderConfig: RenderConfig) {
    if(renderConfig.shadowMapType) {
      this._renderer.shadowMap.enabled = true;
      this._renderer.shadowMap.type = renderConfig.shadowMapType;
    }

    if(renderConfig.tone?.mapping) {
      this._renderer.toneMapping = renderConfig.tone.mapping;
    }

    if(renderConfig.tone?.exposure) {
      this._renderer.toneMappingExposure = renderConfig.tone.exposure;
    }

    if(renderConfig.clearColor) {
      this._renderer.setClearColor(renderConfig.clearColor);
    }

    if(renderConfig.outputColorSpace) {
      this._renderer.outputColorSpace = renderConfig.outputColorSpace;
    }
  }

  enableShadows(shadowMapType: ShadowMapType) {
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = shadowMapType;
  }

  reset() {
    this._renderer.shadowMap.enabled = false;
    this._renderer.shadowMap.type = PCFShadowMap;
    this._renderer.toneMapping = NoToneMapping;
    this._renderer.toneMappingExposure = 1;
    this._renderer.outputColorSpace = SRGBColorSpace;
    this._renderer.setClearColor(new Color('#000000'));
  }

  get pixelRatio() {
    return this._renderer.getPixelRatio();
  }

  get renderer() {
    return this._renderer;
  }

  get height() {
    return window.innerHeight;
  }

  get width() {
    return window.innerWidth;
  }

  get resolution() {
    return new Vector2(this.width * this.pixelRatio, this.height * this.pixelRatio);
  }
}