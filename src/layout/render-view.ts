import * as THREE from 'three';

export default class RenderView {

  private canvas: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  private scene: THREE.Scene | undefined;

  constructor(parent: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'fixed top-0 left-0 z-[-1]';
    parent.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      antialias: true,
    });

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0,0,3);
    this.camera.lookAt(0,0,0);
    this.updateSize();
  }

  setScene(scene: THREE.Scene) {
    this.scene = scene;
    console.log(this.scene);
    this.renderer.render(this.scene, this.camera);
  }
  
  updateSize() {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.renderer.setSize(size.width, size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();

    if(this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}