import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { MinecraftCube } from './minecraft-cube';

@Exercise('textures')
@Description("<p>A cube with a Minecraft texture.</p>")
export class TextureTest extends OrbitControlledExercise {

  private cube: MinecraftCube;
  
  constructor(view: RenderView) {
    super(view);

    this.cube = new MinecraftCube();
    this.scene.add(this.cube);

    this.enableAutoRotation();
    this.camera.position.set(2, 2, 2);
  }

  async dispose() {
    super.dispose();
    this.cube.dispose();
  }
}