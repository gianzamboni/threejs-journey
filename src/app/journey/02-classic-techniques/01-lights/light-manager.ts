import { Color, Vector3 } from 'three';

import { Position3D } from '#/app/types/exercise';
import { Lights, LightType } from '#/app/utils/light-controllers-utils';
import { Helpers, HelperStatusDict, LightTypeHelper } from './helper-factory';

export class LightManager {
  constructor(
    private lights: Lights,
    private helpers: Helpers,
    private helpersVisibleStatus: HelperStatusDict
  ) {}

  toggleLight(newValue: boolean, { lightType }: {lightType: LightType}) {
    const light = this.lights[lightType];
    light.visible = newValue;
    
    if(lightType in this.helpers) {
      lightType = lightType as LightTypeHelper;
      const helper = this.helpers[lightType];
      if(newValue === false) {
        this.helpersVisibleStatus[lightType] = helper.visible;
      }
      helper.visible = newValue && this.helpersVisibleStatus[lightType];
    }
  }

  updateColor(color: string, { lightType }: {lightType: LightType}) {
    this.lights[lightType].color.set(new Color(color));
  }

  updateGroundColor(color: string) {
    this.lights.hemisphere.groundColor.set(new Color(color));
  }

  updateLookAt(_: number, { target }: { target: Position3D }) {
    const newTarget = new Vector3(target.x, target.y, target.z);
    this.lights.rectArea.lookAt(newTarget);
  }

  updateSpotHelper() {
    this.helpers.spot.update();
  }
}
