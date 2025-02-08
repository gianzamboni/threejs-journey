import * as THREE from "three";
import OrbitControlledExercise from "@/journey/exercises/orbit-controlled-exercise";
import { createRedCube } from "@/utils/default-shapes";
import RenderView from "@/layout/render-view";

export class OrbitControlsTest extends OrbitControlledExercise {

  public static id = 'cameras';
 
  private cube: THREE.Mesh;

  constructor(view: RenderView) {
    super(view);
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