import * as THREE from 'three'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { AnimationLoop } from '../../utils/animation-loop';
import { dispose } from '../../utils/dispose';

/*
  This exercise has some issues:
    - It leaves some dangling objects in memory 
*/

export class MaterialExercise {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.view.toggleOrbitControls(true);

    this.view.setCamera({
      position: { x: 2, y: 1, z: 3 },
      lookAt: { x: 0, y: 0, z: 0 }
    });

    this.clock = new THREE.Clock();

    this.gui = new GUI();
    
    this.physicalMaterial = this.createMaterial();
    this.addGuiTweaks();

    this.geometries = [
      new THREE.SphereGeometry(0.5, 64, 64),
     new THREE.PlaneGeometry(1, 1, 100, 100),
     new THREE.TorusGeometry(0.3, 0.2, 64, 128)
    ]
    
    this.meshes = this.geometries.map(geometry => new THREE.Mesh(geometry, this.physicalMaterial));
    this.meshes.forEach((mesh, index) => {
      mesh.position.x = index * 1.5 - 1.5;
      this.scene.add(mesh)
    });

    this.animationLoop = new AnimationLoop(() => this.animationFrame());

  }

  async init() {
    this.envMap = await this.loadEnvironmentMap();
    this.animationLoop.start();
    this.view.show(this.scene);
  }
  
  animationFrame() {
    const elapsedTime = this.clock.getElapsedTime();

    this.meshes.forEach(mesh => {
      mesh.rotation.x = -0.15 * elapsedTime;
      mesh.rotation.y = 0.1 * elapsedTime;
    });

    this.view.render(this.scene);
  }

  async loadEnvironmentMap() {
    const rgbeLoader = new RGBELoader();
    const environmentMap = await rgbeLoader.loadAsync('./textures/environmentMap/2k.hdr');
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    this.scene.background = environmentMap;
    this.scene.environment = environmentMap;
    return environmentMap;
  }

  addGuiTweaks() {
    this.gui.add(this.physicalMaterial, 'metalness').min(0).max(1).step(0.0001);
    this.gui.add(this.physicalMaterial, 'roughness').min(0).max(1).step(0.0001);
    this.gui.add(this.physicalMaterial, 'transmission').min(0).max(1).step(0.0001);
    this.gui.add(this.physicalMaterial, 'ior').min(1).max(10).step(0.0001);
    this.gui.add(this.physicalMaterial, 'thickness').min(0).max(1).step(0.0001);
  }

  createMaterial() {
    return new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.15,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5
    });
  }

  async dispose() {
    await this.animationLoop.stop();
    this.scene.background.dispose(); 
    this.scene.background = null;

    this.scene.environment.dispose();
    this.scene.environment = null;
    
    this.meshes.forEach(mesh => {
      this.scene.remove(mesh);
    });

    this.meshes.forEach(mesh => {
      dispose(mesh);
    });

    this.physicalMaterial.dispose();
    this.envMap.dispose();
    this.gui.destroy();
  }
}