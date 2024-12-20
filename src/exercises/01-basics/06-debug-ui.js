import * as THREE from 'three'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { AnimationLoop } from '../../utils/animation-loop'
import { dispose } from '../../utils/dispose';

export class DebugUI {
  constructor(view) {
    this.view = view;

    this.debugOject = {
      color: '#a778d8',
      spin: this.spin.bind(this),
      subdivision: 2
    }

    this.view.toggleOrbitControls(true);
    
    this.createScene();

    this.animationLoop = new AnimationLoop(() => this.animate());

    this.gui = new GUI({
      width: 300,
      title: 'Nice debug UI',
      closeFolders: false
    })

    this.addGuiTweaks();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.geometry = new THREE.BoxGeometry(1, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ color: this.debugOject.color, wireframe: true })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  spin() {
    gsap.to(this.mesh.rotation, { duration: 1, y: this.mesh.rotation.y + Math.PI * 2 })
  }

  addGuiTweaks() {
    const cubeTweaks = this.gui.addFolder('Awesome cube')
    cubeTweaks.add(this.mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation');
    cubeTweaks.add(this.mesh, 'visible');
    cubeTweaks.add(this.material, 'wireframe');
    cubeTweaks.addColor(this.debugOject, 'color').onChange(() => {
      this.material.color.set(this.debugOject.color)
    });
    cubeTweaks.add(this.debugOject, 'spin');
    cubeTweaks.add(this.debugOject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
      this.mesh.geometry.dispose()
      this.mesh.geometry = new THREE.BoxGeometry(1, 1, 1, this.debugOject.subdivision, this.debugOject.subdivision, this.debugOject.subdivision)
    });
  }

  init() {
    this.animationLoop.start();
    this.view.show(this.scene);
  }
  
  animate() {
    this.view.render(this.scene)
  }

  async dispose() {
    await this.animationLoop.stop();
    this.gui.destroy();
    this.scene.remove(this.mesh);
    dispose(this.mesh);
  }

}