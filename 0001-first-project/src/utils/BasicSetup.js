import * as THREE from 'three'
import { createCube } from './cube'

export const RENDERER_SIZE = {
  width: 800,
  height: 600
}

export function basicRenderer(size) {
  const canvas = document.querySelector('canvas.webgl')
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  return [renderer, canvas];
}

export function basicCamera(scene, position) {
  const camera = new THREE.PerspectiveCamera(75, RENDERER_SIZE.width / RENDERER_SIZE.height, 1, 100)
  camera.position.z = position.z ?? 3
  scene.add(camera)
  return camera;
}


export class BasicSetup {

  constructor(config) {
    this.size = config.size ?? RENDERER_SIZE;
    [this.renderer, this.canvas] = basicRenderer(this.size);
    this.scene = new THREE.Scene();
    this.camera = basicCamera(this.scene, config?.cameraPosition);
    this.clock = new THREE.Clock();

    if(config?.withCube === true) this.setupInitialCube();
  }

  add(object) {
    this.scene.add(object);
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
  }

  toggleFullscreen() {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    this.updateSize(window.innerWidth, window.innerHeight);
  }
}