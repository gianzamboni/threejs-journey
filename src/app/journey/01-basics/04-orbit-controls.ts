import * as THREE from "three";
import { createRedCube } from "@/app/utils/default-shapes";
import RenderView from "@/app/layout/render-view";
import { Exercise, OrbitControllerDescription } from "@/app/decorators/exercise";
import OrbitControlledExercise from "@/app/journey/exercises/orbit-controlled-exercise";

@Exercise('cameras')
@OrbitControllerDescription()
export class OrbitControlsTest extends OrbitControlledExercise {
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