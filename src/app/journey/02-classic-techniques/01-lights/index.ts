import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { Timer } from 'three/addons/misc/Timer.js';

import RenderView from '@/app/layout/render-view';
import { Quality } from '@/app/layout/quality-selector';
import { Exercise } from '@/app/decorators/exercise';
import OrbitControlledExercise from '@/app/journey/exercises/orbit-controlled-exercise';
import { DebugFPS } from '@/app/decorators/debug';
import { QualityConfig, QUALITY_CONFIG } from './quality-config';
import { Customizable } from '@/app/decorators/customizable';
import { LIGHTS_CONFIG, HELPERS_CONFIG } from './debug-ui-configs';
import { Helpers, HelperStatusDict, Lights } from './types';

@Exercise('lights')
export class LightsExercise extends OrbitControlledExercise {
  private quality: QualityConfig;
  private material: THREE.MeshStandardMaterial;
  private animatedObjects: THREE.Mesh[];
  private plane: THREE.Mesh;

//  @Customizable([
    // {
    //   propertyPath: "/.*/.onOff",
    //   initialValue: true,
    //   type: 'master',
    //   settings: {
    //     name: "On/Off",
    //     onChange: "toggleLight"
    //   }
    // }])
  //   '.*': [{
  //     propertyPath: "onOff",
  //     initialValue: true,
  //     isMaster: true,
  //     configuration: {
  //       name: "On/Off",
  //       onChange: "toggleLight"
  //     },
  //   }, {
  //     propertyPath: "color",
  //     isColor: true,
  //     configuration: {
  //       onChange: "updateColor"
  //     }
  //   }, {
  //     propertyPath: "intensity",
  //     configuration: {
  //       min: 0,
  //       max: 6,
  //       step: 0.01
  //     }
  //   }],
  //   'directional|point|rectArea|spot': positinalConfig('position'),
  //   'hemisphere': [{
  //     propertyPath: "groundColor",
  //     isColor: true,
  //     configuration: {
  //       onChange: "updateGroundColor"
  //     }
  //   }],
  //   'point|spot': [{
  //     propertyPath: "distance",
  //     configuration: {
  //       min: 0,
  //       max: 10,
  //       step: 0.01
  //     }
  //   }, {
  //     propertyPath: "decay",
  //     configuration: {
  //       min: 0,
  //       max: 2,
  //       step: 0.01
  //     }
  //   }],
  //   'rectArea': [{
  //     propertyPath: "width",
  //     configuration: SIZE_CONFIG
  //   }, {
  //     propertyPath: "height",
  //     configuration: SIZE_CONFIG
  //   },
  //   ...positinalConfig('lookAt', 'updateLookAt', 0),
  //   ],
  //   'spot': [{
  //     propertyPath: "angle",
  //     configuration: {
  //       min: 0,
  //       max: Math.PI * 0.5,
  //       step: 0.01
  //     }
  //   }, {
  //     propertyPath: "penumbra",
  //     configuration: {
  //       min: 0,
  //       max: 1,
  //       step: 0.01
  //     }
  //   }, 
  //   ...positinalConfig('target.position')
  //   ]
  // })
  @Customizable(LIGHTS_CONFIG)
  private ligths: Lights;

  // @CustomizableEntries({
  //   '.*': [{
  //     propertyPath: "visible",
  //     initialValue: true,
  //     configuration: {
  //       name: "Show helper",
  //     }
  //   }]
  // })
  @Customizable(HELPERS_CONFIG)
  private helpers: Helpers;

  private helpersVisibleStatus: HelperStatusDict;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.quality = QUALITY_CONFIG[quality];
    this.camera.position.set(2, 1, 3);
    this.material = new THREE.MeshStandardMaterial();
    this.material.roughness = 0.4;

    this.animatedObjects = this.createAnimatedObjects();
    this.plane = this.createPlane();

    RectAreaLightUniformsLib.init();
    this.ligths = this.createLights();

    [this.helpers, this.helpersVisibleStatus] = this.createLightHelpers();

    this.scene.add(
      ...this.animatedObjects, 
      this.plane,
      ...Object.values(this.ligths),
      this.ligths.spot.target,
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
    for(const helper of Object.values(this.helpers)) {
      helper.dispose();
    }
    this.ligths.spot.target.clear();
    for(const light of Object.values(this.ligths)) {
      light.dispose();
    }
    this.plane.geometry.dispose();
    for(const object of this.animatedObjects) {
      object.geometry.dispose();
    }
    this.material.dispose();
  }

  toggleLight(newValue: boolean, lightName: keyof typeof LightsExercise.prototype.ligths) {
    const light = this.ligths[lightName];
    light.visible = newValue;
    if(lightName in this.helpers) {
      lightName = lightName as keyof typeof this.helpers;
      const helper = this.helpers[lightName];
      if(newValue === false) {
        this.helpersVisibleStatus[lightName] = helper.visible;
      }
      helper.visible = newValue && this.helpersVisibleStatus[lightName];
    }
  }

  updateColor(color: string, lightName: keyof typeof LightsExercise.prototype.ligths) {
    const light = this.ligths[lightName];
    light.color.set(new THREE.Color(color));
  }

  updateGroundColor(color: string) {
    this.ligths.hemisphere.groundColor.set(new THREE.Color(color));
  }

  updateLookAt(_: number, _1:string, lookAtCoords: {x: number, y: number, z: number}) {
    const newTarget = new THREE.Vector3(lookAtCoords.x, lookAtCoords.y, lookAtCoords.z);
    this.ligths.rectArea.lookAt(newTarget);
  }
  
  createAnimatedObjects() {
    const geometries = [
      new THREE.SphereGeometry(0.5, this.quality.sphereSegments, this.quality.sphereSegments),
      new THREE.BoxGeometry(0.75, 0.75, 0.75, 1, 1, 1),
      new THREE.TorusGeometry(0.3, 0.2, this.quality.torus.radialSegments, this.quality.torus.tubularSegments),
    ]
    const objects = geometries.map(geometry => new THREE.Mesh(geometry, this.material));

    objects[0].position.x = -1.5;
    objects[2].position.x = 1.5;

    return objects;
  }

  createPlane() {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 1, 1), this.material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;
    return plane;
  }

  createLights() {
    const lights = {
      ambient: new THREE.AmbientLight(0xffffff, 0.2),
      directional: new THREE.DirectionalLight(0x00fffc, 0.9),
      hemisphere: new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9),
      point: new THREE.PointLight(0xff9000, 1.5, 0, 2/*0, 2*/),
      rectArea: new THREE.RectAreaLight(0x4e00ff, 6, 1, 1),
      spot: new THREE.SpotLight(0x78ff00, 4.5, 5, Math.PI * 0.1, 0.25, 1)
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
      directional: new THREE.DirectionalLightHelper(this.ligths.directional, 0.2),
      point: new THREE.PointLightHelper(this.ligths.point, 0.2),
      rectArea: new RectAreaLightHelper(this.ligths.rectArea),
      spot: new THREE.SpotLightHelper(this.ligths.spot)
    }

    const status = Object.keys(helpers).reduce((acc, key) => {
      acc[key as keyof Helpers] = true;
      return acc;
    }, {} as HelperStatusDict);

    helpers.point.visible = this.quality.pointLightEnabled;
    status.point = this.quality.pointLightEnabled;
    
    return [helpers, status];
  }
}
