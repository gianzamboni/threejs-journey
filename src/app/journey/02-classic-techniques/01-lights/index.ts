import { MeshStandardMaterial } from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { CustomizableQuality, DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { ExtraConfig, Position3D } from '#/app/types/exercise';
import { Lights, LightType } from '#/app/utils/light-controllers-utils';
import { disposeObjects } from '#/app/utils/three-utils';
import { HELPERS_CONFIG, LIGHTS_CONFIG } from './debug-ui-configs';
import { Floor } from './floor';
import { HelperFactory, Helpers } from './helper-factory';
import { LightFactory } from './light-factory';
import { LightManager } from './light-manager';
import { QUALITY_CONFIG, QualityConfig } from './quality-config';
import { SolidCollection } from './solid-collection';

@Exercise('lights')
@Description("<p>A scene with each type of light offered by Three.js.</p>")
@CustomizableQuality
export class LightsExercise extends OrbitControlledExercise {
  private quality: QualityConfig;
  private material: MeshStandardMaterial;
  private solidCollection: SolidCollection;
  private floor: Floor;
  private lightManager: LightManager;

  @Customizable(LIGHTS_CONFIG)
  private lights: Lights;

  @Customizable(HELPERS_CONFIG)
  private helpers: Helpers;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    this.quality = QUALITY_CONFIG[extraConfig.quality];
    this.material = new MeshStandardMaterial({ roughness: 0.4 });
    this.solidCollection = new SolidCollection(this.material, this.quality);
    this.floor = new Floor(this.material);

    import('three/addons/lights/RectAreaLightUniformsLib.js').then(({ RectAreaLightUniformsLib }) => {
      RectAreaLightUniformsLib.init();
    });

    this.scene.add(this.floor, this.solidCollection);
    this.camera.position.set(2, 1, 3);
     
    this.lights = LightFactory.createLights(this.quality);
    const [helpers, helpersVisibleStatus] = HelperFactory.createHelpers(this.lights, this.quality);
    this.helpers = helpers;
    this.lightManager = new LightManager(this.lights, this.helpers, helpersVisibleStatus);

    this.scene.add(
      ...Object.values(this.lights),
      this.lights.spot.target,
      ...Object.values(this.helpers),
    );
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    this.lightManager.updateSpotHelper();
    this.solidCollection.frame(timer);
  }

  async dispose() {
    await super.dispose();
    this.lights.spot.target.clear();
    disposeObjects(
      ...Object.values(this.helpers),
      ...Object.values(this.lights),
      this.solidCollection,
      this.material,
      this.floor
    );
  }

  toggleLight(newValue: boolean, { lightType }: {lightType: LightType}) {
    this.lightManager.toggleLight(newValue, { lightType });
  }

  updateColor(color: string, { lightType }: {lightType: LightType}) {
    this.lightManager.updateColor(color, { lightType });
  }

  updateGroundColor(color: string) {
    this.lightManager.updateGroundColor(color);
  }

  updateLookAt(_: number, { target }: { target: Position3D }) {
    this.lightManager.updateLookAt(_, { target });
  }
}
