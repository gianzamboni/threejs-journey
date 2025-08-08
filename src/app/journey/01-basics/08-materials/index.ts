import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { CustomizableQuality, DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { ExtraConfig } from '#/app/types/exercise';
import { PHYSICAL_MATERIAL_CONFIGS } from './debug-ui-configs';
import { GlassCollection } from './glass-collection';
import { QUALITY_CONFIG, QualityConfig } from './quality-config';

import { EnvironmentMap } from '../../common/environment-map';


@Exercise('materials')
@Description(
  "<p>Some objects setted up with physical materials.</p>",
  "<p>You can customize the material with the hidden ui</p>"
)
@CustomizableQuality
export class MaterialsTest extends OrbitControlledExercise {
  private qualityconfig: QualityConfig;

  @Customizable(PHYSICAL_MATERIAL_CONFIGS)
  private meshCollection: GlassCollection;
  private environmentMap: EnvironmentMap;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);

    this.qualityconfig = QUALITY_CONFIG[extraConfig.quality];

    this.environmentMap = new EnvironmentMap('env-maps/alley/2k.hdr');
    this.environmentMap.addTo(this.scene);

    this.meshCollection = new GlassCollection(this.qualityconfig);
    this.meshCollection.addTo(this.scene);

    this.camera.position.set(2, 1, 3);
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    this.meshCollection.frame(timer);
  }
  
  async dispose() {
    super.dispose();
    this.meshCollection.dispose();
    this.scene.environment?.dispose();
    this.environmentMap.dispose();
  }
}