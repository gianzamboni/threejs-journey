import * as THREE from 'three';

import { Timer } from 'three/examples/jsm/Addons.js';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from '#/app/layout/render-view';

import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import { AssetLoader } from '#/app/utils/assets-loader';

@Exercise("Raycaster")
@Description([
  "This is a simple 3D interaction demo.", 
  "The <strong>duck</strong> will grow when the <strong>mouse is over</strong> it.",
  "The <strong>spheres</strong> will change color when the <strong>mouse is over</strong> them.",
])
export default class Raycaster extends OrbitControlledExercise {
  
  private geometry: THREE.SphereGeometry;
  private spheres: THREE.Mesh[];

  private raycaster: THREE.Raycaster; 

  private mouse: THREE.Vector2;

  private duck: THREE.Mesh | undefined;

  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;


  constructor(view: RenderView) {
    super(view);
    this.geometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.spheres = this.createObjects();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.1);
    this.directionalLight.position.set(1, 2, 3);
    this.scene.add(...this.spheres, this.ambientLight, this.directionalLight);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupListeners();
    this.loadDuck();
  }

  private createObjects() {
    const objects = [];

    for(let i = 0; i < 3; i++) {
      const object = new THREE.Mesh(
        this.geometry, 
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
      );
      object.position.x = -2 + i * 2;
      objects.push(object);
    }

    return objects;
  }

  private setupListeners() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  private loadDuck() {
    const loader = AssetLoader.getInstance();
    loader.loadModel('models/Duck/glTF/Duck.gltf', (model: GLTF) => {
      this.duck = model.scene.children[0].children[0] as THREE.Mesh;
      this.duck.scale.set(0.00625, 0.00625, 0.00625);
      this.duck.position.y = -1.2;
      this.scene.add(this.duck);
    });
  }

  frame(timer: Timer): void {
    super.frame(timer);

    const elapsedTime = timer.getElapsed();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.updateSpherePosition(elapsedTime);
    this.handleSphereIntersections();
    this.handleDuckIntersections();
  }

  private updateSpherePosition(elapsedTime: number) {
    this.spheres[0].position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    this.spheres[1].position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    this.spheres[2].position.y = Math.sin(elapsedTime * 1.4) * 1.5;
  }

  private handleDuckIntersections() {
    if(this.duck) {
      const intersectDuck = this.raycaster.intersectObject(this.duck);
      if(intersectDuck.length > 0) { 
        this.duck.scale.set(0.01, 0.01, 0.01);
      } else {
        this.duck.scale.set(0.00625, 0.00625, 0.00625);
      }
    }
  }

  private handleSphereIntersections() {
    const intersects = this.raycaster.intersectObjects(this.spheres);

    for(const object of this.spheres) {
      if(intersects.some(intersect => intersect.object === object)) {
        (object.material as THREE.MeshBasicMaterial).color.set(0x00ff00);
      } else {
        (object.material as THREE.MeshBasicMaterial).color.set(0xff0000);
      }
    }
  }

  async dispose() {
    await super.dispose();
    this.ambientLight.dispose();
    this.directionalLight.dispose();
    this.geometry.dispose(); 
    for(const object of this.spheres) {
      (object.material as THREE.MeshBasicMaterial).dispose();
    }

    this.duck?.geometry.dispose();
    (this.duck?.material as THREE.MeshStandardMaterial).dispose();
  }  
}
