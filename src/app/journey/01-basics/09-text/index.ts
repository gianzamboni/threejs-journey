import { 
  MeshMatcapMaterial, 
  Texture,
  SRGBColorSpace,
} from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeObjects } from '#/app/utils/three-utils';
import { RandomizedDonutCollection } from './randomized-donut-collection';
import { ThreeJsText } from './text-3d-mesh';

@Exercise('text-3d')
@Description("<p>A bunch of randomly placed donuts and a text in 3D.</p>")
export class Text3D extends OrbitControlledExercise {
  private loader: AssetLoader;

  private matcapTexture: Texture;
  private material: MeshMatcapMaterial;

  private donuts: RandomizedDonutCollection;

  private text: ThreeJsText | undefined;
  
  constructor(view: RenderView) {
    super(view);
    this.camera.position.set(3,0,6);
    this.camera.lookAt(0,0,0);

    this.loader = AssetLoader.getInstance();
    this.matcapTexture = this.loader.loadTexture('textures/matcaps/8.png');
    this.matcapTexture.colorSpace = SRGBColorSpace;

    this.material = new MeshMatcapMaterial({
      matcap: this.matcapTexture,
    });

    this.donuts = new RandomizedDonutCollection(this.material);
    this.donuts.addTo(this.scene);
    this.generateText();
  }

  frame(timer: Timer): void {
    super.frame(timer);
    this.donuts.frame();
  }

  generateText() {
    this.loader.loadFont('fonts/helvetiker_regular.typeface.json', (font) => {
      this.text = new ThreeJsText({
        font: font,
        material: this.material,
      });
      this.text.addTo(this.scene);
    });
  }
  
  async dispose() {
    await super.dispose();
    disposeObjects(this.material, this.matcapTexture);
    this.text?.dispose();
  }
}