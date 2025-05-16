import { Group, Mesh, TorusGeometry, SphereGeometry, Material } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";

import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";

export default class SuzanneScene {
  
  private suzanne: Group | undefined;
  private torus: Mesh;
  private sphere: Mesh;

  private exercise: OrbitControlledExercise;
  private material: Material;

  constructor(material: Material, exercise: OrbitControlledExercise) {
    this.material = material;
    this.exercise = exercise;

    this.torus = this.createTorus();
    this.sphere = this.createSphere();

    this.exercise.scene.add(this.torus, this.sphere);
    this.loadSuzanne()
    
    this.exercise.camera.fov = 25;
    this.exercise.camera.position.set(7, 5, 6);
    this.exercise.camera.updateProjectionMatrix();
  }

  public frame(timer: Timer) {
    const elapsedTime = timer.getElapsed();

    if(this.suzanne) {
      this.suzanne.rotation.x = -elapsedTime * 0.1;
      this.suzanne.rotation.y = elapsedTime * 0.2;
    }

    this.torus.rotation.x = -elapsedTime * 0.1;
    this.torus.rotation.y = elapsedTime * 0.2;
    
    this.sphere.rotation.x = -elapsedTime * 0.1;
    this.sphere.rotation.y = elapsedTime * 0.2;
  }

  public dispose() {
    disposeMesh(this.torus, this.sphere);
  }

  private createTorus() {
    const geometry = new TorusGeometry(0.6, 0.25, 128, 32);
    const torus = new Mesh(geometry, this.material);
    torus.position.x = 3;
    return torus;
  }

  private createSphere() {
    const geometry = new SphereGeometry();
    const sphere = new Mesh(geometry, this.material);
    sphere.position.x = -3;
    return sphere;
  }

  private loadSuzanne() {
    AssetLoader.getInstance().loadModel("./models/suzanne.glb", (model) => {
      this.suzanne = model;
      this.suzanne.traverse((child) => {
        if(child instanceof Mesh) {
          (child as Mesh).material = this.material;
        }
      })
      this.exercise.scene.add(this.suzanne);
    });
  }
}