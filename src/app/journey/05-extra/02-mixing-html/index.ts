import { 
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  ReinhardToneMapping,
} from "three";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('mixing-webgl-and-html')
@Description(
  '<p>Here, I have added some html elements that moves along with the camera and merge with the scene.</p>'
)
export class MixingHtml extends OrbitControlledExercise {  
  constructor(view: RenderView) {
    super(view);
    this.loadEnvironmentMap();
    this.loadModel();

    this.view.setRender({
      shadowMapType: PCFShadowMap,
      tone: {
        mapping: ReinhardToneMapping,
        exposure: 1.5,
      }
    })
    this.camera.position.set(4, 1, -4);
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
  }

  private loadEnvironmentMap() {
    const environmentMap = AssetLoader.getInstance().loadCubeTexture('env-maps/street', "jpg");
    this.scene.background = environmentMap;
    this.scene.environment = environmentMap;
  }

  private loadModel() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(2, 2, 2)
      gltf.scene.rotation.y = Math.PI * 0.5
      this.scene.add(gltf.scene);
      this.updateAllMaterials();
    });
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if(child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  async dispose() {
    await super.dispose();
  }
}
