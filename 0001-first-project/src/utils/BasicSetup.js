import * as THREE from 'three'
import { createCube } from './cube'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const RENDERER_SIZE = {
  width: 800,
  height: 600
};

export const DEFAULT_CAMERA_POSITION = {
  z: 3,
};

export function basicRenderer(size) {
  console.log(`Creating renderer...`);
  const canvas = document.querySelector('canvas.webgl')
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  return [renderer, canvas];
}

export function basicCamera(scene, position) {
  console.log(`Creating camera at ${position}`);
  const camera = new THREE.PerspectiveCamera(75, RENDERER_SIZE.width / RENDERER_SIZE.height, 1, 100)
  camera.position.z = position.z ?? 3
  scene.add(camera)
  return camera;
}


export class BasicSetup {

  constructor(config = {}) {
    console.log(config);
    this.size = config?.responsive ? {
     width: window.innerWidth,
      height: window.innerHeight 
    } : RENDERER_SIZE;
    if(config?.responsive) this.setupResponsiveCanvas();

    const cameraPosition = config?.cameraPosition ?? DEFAULT_CAMERA_POSITION;
    console.log(`Setting up ${this.size.width}x${this.size.height} canvas ${config.withCube ? 'with' : 'without'} cube and camera at z=${cameraPosition.z}`);
    [this.renderer, this.canvas] = basicRenderer();
    this.scene = new THREE.Scene();
    this.camera = basicCamera(this.scene, cameraPosition);
    this.clock = new THREE.Clock();

    if(config?.withCube === true) this.setupInitialCube();
    if(config?.withControls === true) this.setupControls();
    this.updateSize(this.size.width, this.size.height);
  }

  setupResponsiveCanvas() {
    window.addEventListener('resize', () => {
      this.updateSize(window.innerWidth, window.innerHeight);
    });
  }

  add(object) {
    this.scene.add(...arguments);
    this.render();
  }

  setupInitialCube(){
    this.cube = createCube(0);
    this.add(this.cube);
    this.camera.lookAt(this.cube.position);
  }
  
  moveCube(newPosition) {
    this.cube.position.x = newPosition.x;
    this.cube.position.y = newPosition.y;
    this.camera.lookAt(this.cube.position);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate(action) {
    action(this.clock);
    this.render();
    window.requestAnimationFrame(this.animate.bind(this, action));
  }

  updateSize(width, height) {
    this.size.width = width;
    this.size.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render();
  }

  toggleFullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    this.updateSize(window.innerWidth, window.innerHeight);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    this.animate(() => {
      this.controls.update();
    });
  }
}