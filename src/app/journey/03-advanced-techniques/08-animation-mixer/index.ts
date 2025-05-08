import { 
  AnimationAction, 
  AnimationMixer, 
  CineonToneMapping, 
  CircleGeometry, 
  CubeTexture, 
  DirectionalLight, 
  Mesh, 
  MeshStandardMaterial, 
  RepeatWrapping, 
  SRGBColorSpace 
} from "three";

import { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { ActionButton, Description, Exercise } from "#/app/decorators/exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import IDLE from './icons/idle.svg?raw';
import RUN from './icons/run.svg?raw';
import WALK from './icons/walk.svg?raw';
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";
import { ENV_MAP_CONTROLLERS, LIGHT_CONTROLLERS } from "./ui-controllers";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

type Actions = {
  idle: AnimationAction;
  walk: AnimationAction;
  run: AnimationAction;
}

@Exercise('animation-mixer')
@Description('<strong>A fox with multiple animation. Select whichever you desire with the buttons above</strong>')
export class AnimationMixerTest extends OrbitControlledExercise {
  @Customizable(ENV_MAP_CONTROLLERS)
  private envMapIntensity: number;

  private envMap: CubeTexture;
  private foxMixer: AnimationMixer | null = null;
  private fox: GLTF | null = null;
  private currentAction: AnimationAction | null = null;
  private actions: Actions | null = null;
  private floor: Mesh;
  private quality: QualityConfig;

  @Customizable(LIGHT_CONTROLLERS)
  private directionalLight: DirectionalLight;
  
  constructor(view: RenderView, quality: Quality) {
    super(view);

    this.quality = QUALITY_CONFIG[quality];
    this.envMapIntensity = 0.4;
    this.envMap = this.loadEnvTexture();
    this.scene.environment = this.envMap;

    this.floor = this.createFloor();
    this.directionalLight = this.createDirectionalLight();

    this.loadFox();

    this.scene.add(this.floor, this.directionalLight);
    this.camera.fov = 35;
    this.camera.position.set(6,4,8);
    this.camera.updateProjectionMatrix();

    this.view.setRender({
      shadowMap: {
        enabled: true,
        type: this.quality.shadowMap.type
      },
      tone: {
        mapping: CineonToneMapping,
        exposure: 1.75,
      },
      clearColor: '#211d20'
    });
  }

  createDirectionalLight() {
    const light = new DirectionalLight('#ffffff', 4);
    light.castShadow = true;
    light.shadow.camera.far = 15;
    light.shadow.mapSize.set(
      this.quality.shadowMap.size,
      this.quality.shadowMap.size
    );
    light.shadow.normalBias = 0.05;
    light.position.set(3.5, 2, -1.25);
    return light;
  }

  loadEnvTexture() {
    const envMap = AssetLoader.getInstance()
      .loadCubeTexture('/env-maps/street', 'jpg');

    envMap.colorSpace = SRGBColorSpace;

    return envMap;
  }

  loadFox() {
    AssetLoader.getInstance().loadGLTF('/models/Fox/glTF/Fox.gltf', (gltf) => {
      this.fox = gltf;
      this.fox.scene.scale.set(0.02, 0.02, 0.02);
      this.scene.add(this.fox.scene);

      this.scene.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
          child.material.envMap = this.envMap;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.foxMixer = new AnimationMixer(this.fox.scene);
      this.actions = {
        idle: this.foxMixer.clipAction(this.fox.animations[0]),
        walk: this.foxMixer.clipAction(this.fox.animations[1]),
        run: this.foxMixer.clipAction(this.fox.animations[2]),
      }

      this.changeAnimation('idle');

      this.updateAllMaterials();
    });
  }

  changeAnimation(action: keyof Actions) {
    if(!this.actions) return;

    this.actions[action].reset();
    this.actions[action].play();
    if(this.currentAction) {
      this.actions[action].crossFadeFrom(this.currentAction, 1, false);
    }
    this.currentAction = this.actions[action];
  }

  @ActionButton('Idle', IDLE)
  idle() {
    this.changeAnimation('idle');
  }

  @ActionButton('Walk', WALK)
  walk() {
    this.changeAnimation('walk');
  }

  @ActionButton('Run', RUN)
  run() {
    this.changeAnimation('run');
  }

  createFloor() {
    const loader = AssetLoader.getInstance();
    const colorTexture = loader.loadTexture('/textures/dirt/color.jpg');
    colorTexture.colorSpace = SRGBColorSpace;
    colorTexture.repeat.set(1.5, 1.5);
    colorTexture.wrapS = RepeatWrapping;
    colorTexture.wrapT = RepeatWrapping;

    const normalTexture = loader.loadTexture('/textures/dirt/normal.jpg');
    normalTexture.repeat.set(1.5, 1.5);
    normalTexture.wrapS = RepeatWrapping;
    normalTexture.wrapT = RepeatWrapping;

    const floor = new CircleGeometry(5, 64);
    const floorMaterial = new MeshStandardMaterial({
      map: colorTexture,
      normalMap: normalTexture
    });

    const floorMesh = new Mesh(floor, floorMaterial);
    floorMesh.rotation.x = -Math.PI * 0.5;
    floorMesh.receiveShadow = true;
    return floorMesh;
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMapIntensity = this.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    if (this.foxMixer) {
      this.foxMixer.update(timer.getDelta());
    }
  }

  async dispose() {
    super.dispose();
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        disposeMesh(child);
      }
    });

    if(this.actions) {
      for(const action of Object.values(this.actions)) {
        action.stop();
      }
    }
  }
}
