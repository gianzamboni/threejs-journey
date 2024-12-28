import GUI from 'lil-gui';
import * as THREE from 'three';

export class ShadowExercise {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.gui = new GUI();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.material = new THREE.MeshStandardMaterial();

    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    );

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    );
  }
  
  init() {
    this.directionalLight.position.set(2, 2, -1);
    this.scene.add(this.directionalLight);
    this.scene.add(this.ambientLight);
    this.addLightControls();

    this.material.roughness = 0.7;
    this.addMaterialControls();

    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.5;
    this.scene.add(this.sphere, this.plane);

    this.view.setCamera({
      position: { x: 1, y: 1, z: 2 },
      lookAt: { x: 0, y: 0, z: 0 }
    });
    this.view.toggleOrbitControls(true);
    this.view.show(this.scene);
  }

  dispose() {
    this.gui.destroy();
    [this.sphere, this.plane].forEach((object) => {
      this.scene.remove(object);
      object.geometry.dispose();
    });
    this.material.dispose();
    [this.ambientLight, this.directionalLight].forEach((light) => { 
      this.scene.remove(light);
      light.dispose();
    });
  }

  addMaterialControls() {
    const materialFolder = this.gui.addFolder('Objects Material');
    ['metalness', 'roughness'].forEach((property) => {
      materialFolder.add(this.material, property)
        .min(0)
        .max(1)
        .step(0.001);
    });
  }

  addLightControls() {
    const folder = this.gui.addFolder('Ambient Light');
    folder.add(this.ambientLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);

    const directionalLightFolder = this.gui.addFolder('Directional Light');
    directionalLightFolder.add(this.directionalLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);

    const positionFolder = directionalLightFolder.addFolder('Position');
    ['x', 'y', 'z'].forEach((axis) => {
      positionFolder.add(this.directionalLight.position, axis)
        .min(-5)
        .max(5)
        .step(0.001);
    });
  }
}