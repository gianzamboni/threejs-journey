import { 
  WebGLRenderer,
  ShadowMapType,
  NoToneMapping,
  PCFShadowMap,
  ToneMapping,
  Color,
  Vector2,
  ColorSpace,
  SRGBColorSpace,
  WebGLRenderTarget
} from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';

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

  private effectComposer: EffectComposer | undefined;
  private webGLRenderTarget: WebGLRenderTarget | undefined;

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
    } else if(this.effectComposer) {
      this.effectComposer.render();
    } else {
      this._renderer.render(exercise.scene, exercise.camera);
    }
  }

  update() {
    if(this.exercise === undefined) return;
    if(this.effectComposer) {
      this.effectComposer.render();
    } else {
      this._renderer.render(this.exercise.scene, this.exercise.camera);
    }
  }
  
  updateSize() {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this._renderer.setSize(size.width, size.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if(this.effectComposer) {
      this.effectComposer.setSize(size.width, size.height);
      this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

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

    if(this.effectComposer !== undefined) {
      this.effectComposer.passes.forEach(pass => {
        pass.dispose();
      });

      this.effectComposer.dispose();
      this.effectComposer = undefined;
    }
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

  private createEffectComposer() {
    this.webGLRenderTarget = new WebGLRenderTarget(this.width, this.height, {
    //  samples: this.renderer.getPixelRatio() === 1 ? 2 : 0,
    });

    const effectComposer = new EffectComposer(this._renderer, this.webGLRenderTarget);
    effectComposer.setSize(this.width, this.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return effectComposer;
  }

  addEffects(...effect: Pass[]) {
    if(!this.effectComposer) {
      this.effectComposer = this.createEffectComposer();

    }

    effect.forEach(effect => this.effectComposer!.addPass(effect));
  }
}