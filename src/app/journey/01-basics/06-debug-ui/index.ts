import gsap from 'gsap';

import { Callable, Customizable } from '#/app/decorators/customizable';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { DEBUG_UI_CUBE_CONFIG } from './debug-ui-configs';

import { Cube } from '../../common/cube';

@Exercise('debug-ui')
@Description("<p>A customizable Cube, this demo is thought to show a debug ui activated with double click.</p>")
export class DebugUITest extends OrbitControlledExercise {
 
  @Customizable(DEBUG_UI_CUBE_CONFIG)
  private cube: Cube;

  constructor(view: RenderView) {
    super(view);
    this.enableAutoRotation();
    this.cube = new Cube();
    this.scene.add(this.cube);
  }

  @Callable('Awesome Cube', 'Spin')
  spin() {
    gsap.to(this.cube.rotation, { duration: 1, y: this.cube.rotation.y + Math.PI * 2 });
  }

  updateMaterialColor(newColor: string) {
    this.cube.setColor(newColor);
  }

  updateSubdivisions(subdivisions: number) {
    this.cube.updateSubdivisions(subdivisions);
  }
  
  async dispose() {
    super.dispose();
    this.cube.dispose();
  }
}