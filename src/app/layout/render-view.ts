import * as THREE from 'three';

import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { Exercise } from '#/app/types/exercise';
import { isAnimated } from '#/app/utils/exercise-metadata';

export default class RenderView {

  public canvas: HTMLElement;
  private renderer: THREE.WebGLRenderer;

  private exercise: Exercise | undefined;

  constructor(parent: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'fixed top-0 left-0 z-[0]';
    parent.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setClearColor(0x1E1A20, 1);
    this.updateSize();
  }
  
  run(exercise: Exercise) {
    this.exercise = exercise;
    if(isAnimated(exercise)) {
      (this.exercise as AnimatedExercise).startAnimation(this);
    } else {
      this.renderer.render(exercise.scene, exercise.camera);
    }
  }

  update() {
    if(this.exercise === undefined) return;

    this.renderer.render(this.exercise.scene, this.exercise.camera);
  }
  
  updateSize() {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if(this.exercise) {
      this.exercise.updateCamera(size.width / size.height)
      this.renderer.render(this.exercise.scene, this.exercise.camera);
    }
  }

  enableShadows(shadowMapType: THREE.ShadowMapType) {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = shadowMapType;
  }

  reset() {
    this.renderer.shadowMap.enabled = false;
  }

  get height() {
    return this.canvas.clientHeight;
  }
}