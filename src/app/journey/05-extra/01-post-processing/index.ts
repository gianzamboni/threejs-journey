import { 
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  ReinhardToneMapping,
  Vector3
} from "three";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import displacementFrag from "./shaders/displacement.frag";
import displacementVert from "./shaders/displacement.vert";
import tintFrag from "./shaders/tint.frag";
import tintVert from "./shaders/tint.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('post-processing')
@Description(
  '<p>Post-processing is a technique that allows you to apply effects to your scene after it has been rendered. It is a powerful way to enhance the visual quality of your scene.</p>',
  '<p>Here i use <strong>Damaged Helmet</strong> model by <a href="https://www.artstation.com/theblueturtle">Leonardo Carrion</a>.'
)
export class PostProcessing extends OrbitControlledExercise {  
  private directionalLight: DirectionalLight;

  @Customizable([{
    propertyPath: 'tintColor',
    type: 'color',
    initialValue: '#ff0000',
    settings: {
      min: 0,
      max: 1,
      step: 0.001,
      name: 'Tint Color',
      onChange: 'updateTint'
    }
  }])
  private tintPass: ShaderPass;

  private displacementPass: ShaderPass;

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

    this.tintPass = new ShaderPass({
      uniforms: {
        uTint: { value: null },
        tDiffuse: { value: null },
      },
      vertexShader: tintVert,
      fragmentShader: tintFrag,
    });

    this.tintPass.material.uniforms.uTint.value = new Vector3(0.1, 0.0, 0.0);

    this.displacementPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: null },
        uNormalMap: { value: null },
      },
      vertexShader: displacementVert,
      fragmentShader: displacementFrag,
    });

    this.displacementPass.material.uniforms.uTime.value = 0;
    this.displacementPass.material.uniforms.uNormalMap.value = AssetLoader.getInstance().loadTexture('textures/interfaceNormalMap.png');

    this.addPasses();
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    this.displacementPass.material.uniforms.uTime.value = timer.getElapsed();
  }

  public updateTint(tint: string) {
    this.tintPass.material.uniforms.uTint.value = new Color(tint);
  }

  private addPasses() {
    const renderPass = new RenderPass(this.scene, this.camera);
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

    this.view.addEffects(
      renderPass,
      gammaCorrectionPass,
      this.displacementPass,
      this.tintPass,
    );

    if(this.view.renderer.getPixelRatio() === 1 && !this.view.renderer.capabilities.isWebGL2) {
      this.view.addEffects(new SMAAPass());
    }
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
