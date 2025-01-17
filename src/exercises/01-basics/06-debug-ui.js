import * as THREE from 'three'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { dispose } from '../../utils/dispose';

export class DebugUIExercise {
  constructor(view, debugUI) {
    this.view = view;
    this.debugUI = debugUI;
    this.debugOject = {
      color: '#a778d8',
      spin: this.spin.bind(this),
      subdivision: 2
    };
    this.gui = new GUI({
      title: 'Settings',
      closeFolders: false,
      container: debugUI.lilGuiContainer
    });
    this.scene = new THREE.Scene();
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: this.debugOject.color, wireframe: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
  
  init() {
    this.scene.add(this.mesh);
    this.debugUI.register("Triangles");
    this.debugUI.register("Lines");
    this.addGuiTweaks();
    this.view.setOrbitControlSettings({
      autoRotate: true,
      autoRotateSpeed: 1,   
    });
    this.view.show(this.scene);
    this.debugUI.update("Triangles", this.view.trianglesCount);
    this.debugUI.update("Lines", this.view.linesCount);
  }

  async dispose() {
    this.gui.destroy();
    this.scene.remove(this.mesh);
    dispose(this.mesh);
  }

  spin() {
    gsap.to(this.mesh.rotation, { duration: 1, y: this.mesh.rotation.y + Math.PI * 2 });
  }

  addGuiTweaks() {
    const cubeTweaks = this.gui.addFolder('Awesome cube')
    cubeTweaks.add(this.mesh.position, 'y').min(- 3).max(3).step(0.01).name('Elevation');
    cubeTweaks.add(this.mesh, 'visible').name('Visible');
    cubeTweaks.add(this.material, 'wireframe').name('Wireframe').onChange(() => {
      this.updateRenderData();
    });
    cubeTweaks.addColor(this.debugOject, 'color').name("Color").onChange(() => {
      this.material.color.set(this.debugOject.color);
    });
    cubeTweaks.add(this.debugOject, 'spin').name("Spin");
    cubeTweaks.add(this.debugOject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.BoxGeometry(1, 1, 1, this.debugOject.subdivision, this.debugOject.subdivision, this.debugOject.subdivision);
      this.updateRenderData();
    }).name('Subdivision');
  }

  updateRenderData() {
    setTimeout(() => {
      this.debugUI.update("Triangles", this.view.trianglesCount);
      this.debugUI.update("Lines", this.view.linesCount);
    }, 100);

  }
}