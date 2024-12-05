import * as THREE from 'three'

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
  return renderer;
}

export function basicCamera(scene) {
  const camera = new THREE.PerspectiveCamera(75, RENDERER_SIZE.width / RENDERER_SIZE.height, 1, 100)
  camera.position.z = 3
  scene.add(camera)
  return camera;
}


export class BasicSetup {

  constructor() {
    this.renderer = basicRenderer();
    this.scene = new THREE.Scene();
    this.camera = basicCamera(this.scene);
  }

  add(object) {
    this.scene.add(object);
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}