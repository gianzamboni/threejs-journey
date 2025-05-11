import { 
  Color, 
  Texture, 
  Vector2, 
  Vector3 
} from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { Firework } from "./firework";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise("Fireworks")
export default class Fireworks extends OrbitControlledExercise {

  private resolution: Vector2;
  private pixelRatio: number;

  private textures: Texture[];

  constructor(renderView: RenderView) {
    super(renderView);

    this.camera.fov = 25;
    this.camera.position.set(1.5, 0, 6);
    this.camera.updateProjectionMatrix();

    this.resolution = new Vector2(this.view.width, this.view.height);
    this.pixelRatio = this.view.pixelRatio;

    this.textures = this.loadTextures();

    this.view.canvas.addEventListener('click', this.createFirework.bind(this));
    this.view.addEventListener('resize', this.updateResolution.bind(this));

    this.createFirework();
  }

  public createFirework() {
    Firework.create({
      scene: this.scene,
      count: 100,
      position: new Vector3(0, 0, 0),
      size: 0.5,
      texture: this.textures[7],
      spreadRadius: 1,
      color: new Color("#8affff"),
      resolution: this.resolution, 
      pixelRatio: this.pixelRatio,
    });
  }

  private updateResolution() {
    this.resolution.set(this.view.width, this.view.height);
    this.pixelRatio = this.view.pixelRatio;
  }

  private loadTextures() {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((number) => {
      const texture = AssetLoader.getInstance().loadTexture(`textures/particles/${number}.png`);
      texture.flipY = false;
      return texture;
    });
  }

  async dispose() {
    super.dispose();
    this.view.removeEventListener('resize', this.updateResolution.bind(this));
    this.view.removeEventListener('click', this.createFirework.bind(this));

    for (const texture of this.textures) {
      texture.dispose();
    }
  }
}