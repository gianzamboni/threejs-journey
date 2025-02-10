import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import RenderView from '@/app/layout/render-view';
import { createRedCube } from '@/app/utils/default-shapes';
import { DebugFPS, Debuggable } from '../exercises/debug-decorators';

@Debuggable
export class MaterialsTest extends OrbitControlledExercise {

  public static id = 'materials';
  
  private cube: THREE.Mesh;

  constructor(view: RenderView) {
    super(view);
    this.cube = createRedCube();
    this.scene.add(this.cube);
  }

  @DebugFPS
  frame() {
    super.frame();
  }
  async dispose() {
    super.dispose();
    this.cube.geometry.dispose();
    (this.cube.material as THREE.Material).dispose();
  }
}