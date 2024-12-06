import * as THREE from 'three'
import { createCube } from './cube'

export const RENDERER_SIZE = {
  width: 800,
  height: 600
}

export function basicRenderer() {
  const canvas = document.querySelector('canvas.webgl')
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(RENDERER_SIZE.width, RENDERER_SIZE.height)
  return [renderer, canvas];
}

export function basicCamera(scene) {
  const camera = new THREE.PerspectiveCamera(75, RENDERER_SIZE.width / RENDERER_SIZE.height, 1, 100)
  camera.position.z = 3
  scene.add(camera)
  return camera;
}


export class BasicSetup {

  constructor(config = {
    withCube: false
  }) {
    this.size = RENDERER_SIZE;
    [this.renderer, this.canvas] = basicRenderer();
    this.scene = new THREE.Scene();
    this.camera = basicCamera(this.scene);
    
    if(config.withCube) {
      this.cube = createCube(0);
      this.add(this.cube);
      this.camera.lookAt(this.cube.position);
    }
  }

  add(object) {
    this.scene.add(object);
  }
  
  moveCube(newPosition) {
    this.cube.position.x = newPosition.x;
    this.cube.position.y = newPosition.y;
    this.camera.lookAt(this.cube.position);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}