import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js'

export class HauntedHouse {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.lights = { 
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      directional: new THREE.DirectionalLight(0xffffff, 1.5),
    }

    this.timer = new Timer();

    this.materials = {
      standard: new THREE.MeshStandardMaterial({ roughness: 0.7 })
    }

    this.meshes = {
      floor: new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          this.materials.standard
      ),
    }
  }

  init() {
    this.view.setCamera({
      position: { x: 4, y: 2, z: 5 },
      lookAt: { x: 0, y: 0, z: 0 }
    })
    
    this.meshes.floor.rotation.x = - Math.PI * 0.5;
    this.lights.directional.position.set(3, 2, -8);

    Object.values(this.lights).forEach(light => this.scene.add(light));

    Object.values(this.meshes).forEach(mesh => {
        this.scene.add(mesh);
    });

    this.view.toggleOrbitControls();
    this.view.show(this.scene);
  }

  animate() {
    this.timer.update();
    const elaptsedTime = this.timer.getElapsedTime();
  }

  dispose() {
    this.scene.remove(this.sphere);
    Object.values(this.meshes).forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
    });
    Object.values(this.materials).forEach(material => material.dispose());
  }
}