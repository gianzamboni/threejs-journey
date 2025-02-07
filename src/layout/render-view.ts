import AnimatedExercise from '@/constants/exercises/animated-exercise';
import { Exercise } from '@/journey/types';
import * as THREE from 'three';

export default class RenderView {

  public canvas: HTMLElement;
  private renderer: THREE.WebGLRenderer;

  private exercise: Exercise | undefined;

  constructor(parent: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'fixed top-0 left-0 z-[-1]';
    parent.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      antialias: true,
    });

    this.updateSize();
  }
  
  run(exercise: Exercise) {
    this.exercise = exercise;
    if(this.exercise.isAnimated) {
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
}