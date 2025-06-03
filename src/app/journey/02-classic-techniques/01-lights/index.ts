import { 
  AmbientLight,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  PointLight,
  PointLightHelper,
  RectAreaLight,
  SpotLight,
  SpotLightHelper,
  MeshStandardMaterial,
  Mesh,
  SphereGeometry,
  BoxGeometry,
  TorusGeometry,
  PlaneGeometry,
  Vector3,
  Color
} from 'three';

import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { ExtraConfig, Position3D } from '#/app/types/exercise';
import { Lights, LightType } from '#/app/utils/light-controllers-utils';
import { disposeObjects } from '#/app/utils/three-utils';
import { HELPERS_CONFIG, LIGHTS_CONFIG } from './debug-ui-configs';
import { QUALITY_CONFIG, QualityConfig } from './quality-config';

type Helpers = {
  directional: DirectionalLightHelper,
  point: PointLightHelper,
  rectArea: RectAreaLightHelper,
  spot: SpotLightHelper
}

type HelperStatusDict = Record<keyof Helpers, boolean>;
export type LightTypeHelper = keyof Helpers;

@Exercise('lights')
@Description("<strong>A scene with each type of light offered by Three.js.</strong>")
export class LightsExercise extends OrbitControlledExercise {
  private quality: QualityConfig;
  private material: MeshStandardMaterial;
  private animatedObjects: Mesh[];
  private plane: Mesh;

  @Customizable(LIGHTS_CONFIG)
  private lights: Lights;

  @Customizable(HELPERS_CONFIG)
  private helpers: Helpers;

  private helpersVisibleStatus: HelperStatusDict;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);

    import('three/addons/lights/RectAreaLightUniformsLib.js').then(({ RectAreaLightUniformsLib }) => {
      RectAreaLightUniformsLib.init();
    });
    
    this.quality = QUALITY_CONFIG[extraConfig.quality];
    this.camera.position.set(2, 1, 3);
    this.material = new MeshStandardMaterial();
    this.material.roughness = 0.4;

    this.animatedObjects = this.createAnimatedObjects();
    this.plane = this.createPlane();
    this.lights = this.createLights();
    [this.helpers, this.helpersVisibleStatus] = this.createLightHelpers();

    this.scene.add(
      ...this.animatedObjects, 
      this.plane,
      ...Object.values(this.lights),
      this.lights.spot.target,
      ...Object.values(this.helpers),
    );
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);

    const elapsed = timer.getElapsed();
    this.helpers.spot.update();
    for(const object of this.animatedObjects) {
      object.rotation.y = 0.1 * elapsed;
      object.rotation.x = 0.15 * elapsed;
    }
  }

  async dispose() {
    await super.dispose();
    this.lights.spot.target.clear();

    disposeObjects(
      ...Object.values(this.helpers),
      ...Object.values(this.lights),
      this.plane.geometry,
      ...this.animatedObjects.map(obj => obj.geometry),
      this.material
    );
  }

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

  /**
   * Updates the color of a light
   * @param color - The new color value
   * @param {Object} context - The context object containing lightType
   */
  updateColor(color: string, { lightType }: {lightType: LightType}) {
    const light = this.lights[lightType];
    light.color.set(new Color(color));
  }

  updateGroundColor(color: string) {
    this.lights.hemisphere.groundColor.set(new Color(color));
  }

  updateLookAt(_: number, { target }: { target: Position3D }) {
    const newTarget = new Vector3(target.x, target.y, target.z);
    this.lights.rectArea.lookAt(newTarget);
  }
  
  createAnimatedObjects() {
    const geometries = [
      new SphereGeometry(0.5, this.quality.sphereSegments, this.quality.sphereSegments),
      new BoxGeometry(0.75, 0.75, 0.75, 1, 1, 1),
      new TorusGeometry(0.3, 0.2, this.quality.torus.radialSegments, this.quality.torus.tubularSegments),
    ]
    const objects = geometries.map(geometry => new Mesh(geometry, this.material));

    objects[0].position.x = -1.5;
    objects[2].position.x = 1.5;

    return objects;
  }

  createPlane() {
    const plane = new Mesh(new PlaneGeometry(5, 5, 1, 1), this.material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;
    return plane;
  }

  createLights() {
    const lights = {
      ambient: new AmbientLight(0xffffff, 0.2),
      directional: new DirectionalLight(0x00fffc, 0.9),
      hemisphere: new HemisphereLight(0xff0000, 0x0000ff, 0.9),
      point: new PointLight(0xff9000, 1.5, 0, 2/*0, 2*/),
      rectArea: new RectAreaLight(0x4e00ff, 6, 1, 1),
      spot: new SpotLight(0x78ff00, 4.5, 5, Math.PI * 0.1, 0.25, 1)
    };

    lights.directional.position.set(1, 0, 0);
    lights.point.position.set(1, -0.5, 1);
    lights.rectArea.position.set(-1.5, 0, 1.5);
    lights.spot.position.set(0, 2, 3);

    lights.rectArea.lookAt(0, 0, 0);
    lights.spot.target.position.set(-0.75, 0, 0);
    
    lights.point.visible = this.quality.pointLightEnabled;
    return lights;
  }

  createLightHelpers() : [Helpers, HelperStatusDict] {
    const helpers = {
      directional: new DirectionalLightHelper(this.lights.directional, 0.2),
      point: new PointLightHelper(this.lights.point, 0.2),
      rectArea: new RectAreaLightHelper(this.lights.rectArea),
      spot: new SpotLightHelper(this.lights.spot)
    }

    const status = Object.keys(helpers).reduce((acc, key) => {
      acc[key as LightTypeHelper] = true;
      return acc;
    }, {} as HelperStatusDict);

    helpers.point.visible = this.quality.pointLightEnabled;
    status.point = this.quality.pointLightEnabled;
    
    return [helpers, status];
  }
}
