
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { RandomTriangles } from "./random-triangles";

@Exercise('random-triangles')
@Description("<p>A bunch of random generated triangles.</p>")
export class RandomTrianglesExercise extends OrbitControlledExercise {
 
  private triangles: RandomTriangles;

  constructor(view: RenderView) {
    super(view);
    
    this.triangles = new RandomTriangles();
    this.scene.add(this.triangles);

    this.camera.position.y = 1;
    this.camera.position.z = 1;
    this.controls.autoRotateSpeed = 0.5;
    this.enableAutoRotation();

  }
  
  async dispose() {
    await super.dispose();
    this.triangles.dispose();
  }
}