import { DirectionalLight, Mesh, MeshStandardMaterial, PCFShadowMap, ReinhardToneMapping } from "three";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";

import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";

@Exercise('post-processing')
@Description(
  '<p>Post-processing is a technique that allows you to apply effects to your scene after it has been rendered. It is a powerful way to enhance the visual quality of your scene.</p>',
  '<p>Here i use <strong>Damaged Helmet</strong> model by <a href="https://www.artstation.com/theblueturtle">Leonardo Carrion</a>.'
)
export class PostProcessing extends OrbitControlledExercise {  
  private directionalLight: DirectionalLight;

  constructor(view: RenderView) {
    super(view);
    this.loadEnvironmentMap();
    this.loadModel();

    this.directionalLight = this.createDirectionalLight();
    this.camera.position.set(4, 1, -4);
    this.scene.add(this.directionalLight);

    this.view.setRender({
      shadowMapType: PCFShadowMap,
      tone: {
        mapping: ReinhardToneMapping,
        exposure: 1.5,
      }
    })

    this.addPasses();
  }

  frame(timer: Timer) {
    super.frame(timer);
  }

  private addPasses() {
    const renderPass = new RenderPass(this.scene, this.camera);
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    const dotScreenPass = new DotScreenPass();
    const rgbShiftPass = new ShaderPass(RGBShiftShader);

    this.view.addEffects(
      renderPass,
      gammaCorrectionPass,
      dotScreenPass,
      //rgbShiftPass,
    );
  }



  private createDirectionalLight() {
    this.directionalLight = new DirectionalLight('#ffffff', 3);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 3, - 2.25);
    return this.directionalLight;
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
    this.directionalLight.dispose();
  }
}