import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { Matcap } from './matcap';
import { RandomizedDonutCollection } from './randomized-donut-collection';
import { ThreeJsText } from './text-3d-mesh';

@Exercise('text-3d')
@Description("<p>A bunch of randomly placed donuts and a text in 3D.</p>")
export class Text3D extends OrbitControlledExercise {
  private matcap: Matcap;

  private donuts: RandomizedDonutCollection;

  private text: ThreeJsText;
  
  constructor(view: RenderView) {
    super(view);

    this.matcap = new Matcap();

    this.donuts = new RandomizedDonutCollection(this.matcap);
    this.donuts.addTo(this.scene);

    this.text = new ThreeJsText({
      material: this.matcap,
      onCreated: () => {
        this.text.addTo(this.scene);
      }
    })
    this.camera.position.set(3,0,6);
    this.camera.lookAt(0,0,0);
  }

  frame(timer: Timer): void {
    super.frame(timer);
    this.donuts.frame();
  }
  
  async dispose() {
    await super.dispose();
    this.matcap.dispose();
    this.text?.dispose();
  }
}