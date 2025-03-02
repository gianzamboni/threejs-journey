import * as THREE from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise, OrbitControllerDescription } from "#/app/decorators/exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { Lights } from "#/app/utils/light-controllers-utils";
import { LIGHTS_CONFIG, MATERIAL_CONFIG } from "./debug-ui-configs";
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";
type ExerciseLights = Pick<Lights, 'ambient' | 'directional' | 'spot' | 'point'>;

//type Helpers = {
//  directional: THREE.CameraHelper,
//  spot: THREE.CameraHelper,
//  point: THREE.CameraHelper
//}

@Exercise('Shadows')
@OrbitControllerDescription()
export class Shadows extends OrbitControlledExercise {

  private qualityConfig: QualityConfig;

  @Customizable(LIGHTS_CONFIG)
  private lights: ExerciseLights;

  //private helpers: Helpers;


  @Customizable(MATERIAL_CONFIG)
  private material: THREE.MeshStandardMaterial;

  private plane: THREE.Mesh;
  private sphere: THREE.Mesh;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    
    this.qualityConfig = QUALITY_CONFIG[quality];

    view.enableShadows(this.qualityConfig.shadowMapType);

    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.25;

    this.lights = this.createLigths();
    //this.helpers = this.createHelpers();

    this.material = this.createMaterial();

    this.plane = this.createPlane();
    this.sphere = this.createSphere();

    this.camera.position.set(1, 1, 2);

    this.scene.add(
      ...Object.values(this.lights),
      //...Object.values(this.helpers),
      this.lights.spot.target,
      this.plane,
      this.sphere
    );

  }

  toggleLight(newValue: boolean, { lightType }: {lightType: keyof ExerciseLights}) {
    const light = this.lights[lightType];
    light.visible = newValue;
  }

  updateColor(color: string, { lightType }: {lightType: keyof ExerciseLights}) {
    const light = this.lights[lightType];
    light.color.set(color);
  }

  private createMaterial(): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.476;
    material.metalness = 0.7;
    return material;
  }
  
  //private createHelpers(): Helpers {
  //  const helpers = {
  //    directional: new THREE.CameraHelper(this.lights.directional.shadow.camera),
  //    spot: new THREE.CameraHelper(this.lights.spot.shadow.camera),
  //    point: new THREE.CameraHelper(this.lights.point.shadow.camera)
  //  }

    
  //  for(const helperType in helpers) {
  //    helpers[helperType as keyof Helpers].visible = false;
  //  }

  //  return helpers;
  //}

  private createLigths(): ExerciseLights {
    const lights = {
      ambient: new THREE.AmbientLight(0xff0000, 1),
      directional: new THREE.DirectionalLight(0x00ff00, 1.5),
      spot: new THREE.SpotLight(0x0000ff, 3.6, 5, Math.PI * 0.3),
      point: new THREE.PointLight(0xff0000, 2.7)
    }

    lights.directional.position.set(2, 2, -1);
    lights.spot.position.set(0, 2, 2);
    lights.point.position.set(-1, 1, 0);

    [lights.directional, lights.spot, lights.point].forEach((light) => {
      light.castShadow = true;
      light.shadow.mapSize.width = this.qualityConfig.shadowMapSize;
      light.shadow.mapSize.height = this.qualityConfig.shadowMapSize;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 6;
    });

    const directionalShadowCamera = lights.directional.shadow.camera;
    directionalShadowCamera.top = 2;
    directionalShadowCamera.right = 2;
    directionalShadowCamera.bottom = -2;
    directionalShadowCamera.left = -2;
    
    return lights;
  }

  private createPlane(): THREE.Mesh {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    );

    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    plane.castShadow = true;

    return plane;
  }

  private createSphere(): THREE.Mesh {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    );

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    return sphere;
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    //for(const helper of Object.values(this.helpers)) {
    //   helper.update();
    // }
  }
  async dispose() {
    await super.dispose();
    this.material.dispose();
    this.plane.geometry.dispose();
    this.sphere.geometry.dispose();

    //for(const helper of Object.values(this.helpers)) {
    //  helper.dispose();
    //}

    for(const light of Object.values(this.lights)) {
      light.dispose();
    }
  }
}