import * as THREE from "three";
import OrbitControlledExercise from "@/app/journey/exercises/orbit-controlled-exercise";
import { createRedCube } from "@/app/utils/default-shapes";
import RenderView from "@/app/layout/render-view";

export class OrbitControlsTest extends OrbitControlledExercise {

  public static id = 'cameras';
 
  private cube: THREE.Mesh;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.cube = createRedCube();

    this.camera.position.y = 1;
    this.scene.add(this.cube);
  }
  
  async dispose() {
    await super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}