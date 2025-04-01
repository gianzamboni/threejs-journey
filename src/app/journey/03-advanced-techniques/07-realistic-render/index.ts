import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader, loadHelmet } from "#/app/utils/assets-loader";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";
import * as THREE from 'three';
import { SCENE_CONTROLLERS, RENDERER_CONTROLLERS, LIGHT_CONTROLLERS } from "./controllers";
import { disposeMesh } from "#/app/utils/three-utils";
@Exercise('realistic-render')
@Description([
  '<strong>Renderer tweaks to get a more realistic render</strong>',
])
export class RealisticRender extends OrbitControlledExercise {

  @Customizable(SCENE_CONTROLLERS)
  private _scene: THREE.Scene;

  @Customizable(RENDERER_CONTROLLERS)
  private _renderer: THREE.WebGLRenderer;

  private envMap: THREE.Texture | undefined;

  private helmet: THREE.Object3D[] = [];

  @Customizable(LIGHT_CONTROLLERS)
  private directionalLight: THREE.DirectionalLight;

  //private directionalLightCameraHelper: THREE.CameraHelper;

  constructor(view: RenderView) {
    super(view);
    this._scene = this.scene;
    this._scene.environmentIntensity = 1;
    this._renderer = view.renderer;

    this.loadEnvironment();
    this.loadHelmet();

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 6);
    this.directionalLight.position.set(-4, 6.5, 2.5);
    this.directionalLight.castShadow = true;
    this.directionalLight.target.position.set(0, 4, 0);
    this.directionalLight.target.updateMatrixWorld();

    
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.mapSize.set(512, 512);
    //this.directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);


    this._scene.add(this.directionalLight/*, this.directionalLightCameraHelper*/);
    

    this.camera.position.set(4, 5, 4);
    this.controls.target.y = 3.5;
    

    this._renderer.toneMapping = THREE.ReinhardToneMapping;
    this._renderer.toneMappingExposure = 3;

    this._view.enableShadows(THREE.PCFSoftShadowMap);
  }

  loadEnvironment() {
    const loader = AssetLoader.getInstance();
    loader.loadEnvironment('env-maps/alley/2k.hdr', this._scene, (envMap) => {
      this.envMap = envMap;
      this._scene.background = this.envMap;
    });
  }

  loadHelmet() {
    loadHelmet(10, (meshes) => {
      this.helmet = meshes as THREE.Mesh[];
      this._scene.add(...this.helmet);
      this.updateAllMaterials();
    });
  }

  private updateAllMaterials() {
    this._scene.traverse((child) => {
      if('isMesh' in child && child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  async dispose() {
    super.dispose();  
    this.envMap?.dispose();
    disposeMesh(...(this.helmet as THREE.Mesh[]));
    //this.directionalLightCameraHelper.dispose();
    this.directionalLight.dispose();
  }

}
