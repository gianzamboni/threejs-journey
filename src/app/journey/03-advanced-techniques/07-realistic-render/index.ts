import { 
  Mesh,
  Group,
  Texture,
  Scene,
  WebGLRenderer,
  DirectionalLight,
  PlaneGeometry,
  MeshStandardMaterial,
  ReinhardToneMapping
} from 'three';

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import { Quality } from "#/app/layout/quality-selector";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { loadTextureMaps, TextureDict, TextureMaps } from "#/app/utils/textures";
import { disposeMesh, disposeObjects } from "#/app/utils/three-utils";
import { SCENE_CONTROLLERS, RENDERER_CONTROLLERS, LIGHT_CONTROLLERS } from "./controllers";
import { QUALITY_CONFIG, QualityConfig } from "./quality-config";


type RenderedObject = {
  mesh: Mesh;
  textures: TextureDict;
}

@Exercise('realistic-render')
@Description('<strong>Renderer tweaks to get a more realistic render</strong>')
export class RealisticRender extends OrbitControlledExercise {

  @Customizable(SCENE_CONTROLLERS)
  private _scene: Scene;

  @Customizable(RENDERER_CONTROLLERS)
  private _renderer: WebGLRenderer;

  private envMap: Texture | undefined;

  private hamburger: Group | undefined;
  private floor: RenderedObject;
  private wall: RenderedObject;

  @Customizable(LIGHT_CONTROLLERS)
  private directionalLight: DirectionalLight;

  private qualityConfig: QualityConfig;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.qualityConfig = QUALITY_CONFIG[quality];
    this._scene = this.scene;
    this._scene.environmentIntensity = 1;
    this._renderer = view.renderer;

    this.directionalLight = this.createDirectionalLight();
    this.floor = this.createFloor();
    this.wall = this.createWall();

    this.loadEnvironment();
    this.loadHamburger();

    this._scene.add(this.directionalLight, this.floor.mesh, this.wall.mesh);
    
    this.camera.position.set(4, 2.5, 4);
    this.controls.target.y = 0;

    this.setupRenderer();
  }

  setupRenderer() {
    this._renderer.toneMapping = ReinhardToneMapping;
    this._renderer.toneMappingExposure = 3;

    this.view.enableShadows(this.qualityConfig.shadowMapType);
  }

  createFloor() {
    const textures = loadTextureMaps(
      'wood_cabinet_worn_long', 
      '1k', 
      [TextureMaps.Color, {
        type: TextureMaps.Normal,
        format: 'png'
      }, TextureMaps.Arm]
    );
    const mesh = this.createPlane(textures);
    mesh.rotation.x = -Math.PI * 0.5;
    return {
      mesh,
      textures
    };
  }

  createWall() {
    const textures = loadTextureMaps(
      'walls', 
      '1k', 
      [TextureMaps.Color, TextureMaps.Normal, TextureMaps.Arm]
    );
    const mesh = this.createPlane(textures);
    mesh.position.set(0, 4, -4);
    return {
      mesh,
      textures
    };
  }

  createPlane(textures: TextureDict) {
    const mesh = new Mesh(
      new PlaneGeometry(8, 8, 100, 100),
      new MeshStandardMaterial({ 
        map: textures[TextureMaps.Color], 
        normalMap: textures[TextureMaps.Normal],
        aoMap: textures[TextureMaps.Arm],
        roughnessMap: textures[TextureMaps.Arm],
        metalnessMap: textures[TextureMaps.Arm],
      })
    );
    return mesh;
  }

  createDirectionalLight() {
    const directionalLight = new DirectionalLight(0xffffff, 6);
    directionalLight.position.set(-4, 6.5, 2.5);
    directionalLight.castShadow = true;
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.target.updateMatrixWorld();

    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(512, 512);
    directionalLight.shadow.normalBias = 0.025;
    directionalLight.shadow.bias = -0.004;
    return directionalLight;
  }

  loadEnvironment() {
    const loader = AssetLoader.getInstance();
    loader.loadEnvironment('env-maps/alley/2k.hdr', this._scene, (envMap) => {
      this.envMap = envMap;
      this._scene.background = this.envMap;
    });
  }

  loadHamburger() {
    AssetLoader.getInstance()
      .loadModel('/models/Hamburger/hamburger.glb', 
        (model) => {
          this.hamburger = model;
          this.hamburger.scale.set(2.5, 2.5, 2.5);
          this._scene.add(this.hamburger);
          this.updateAllMaterials();
        },
        { useDraco: true }
      );
  }

  private updateAllMaterials() {
    this._scene.traverse((child) => {
      if('isMesh' in child && child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  @DebugFPS
  public frame(timer: Timer): void {
    super.frame(timer);
  }

  async dispose() {
    super.dispose();  
    this.envMap?.dispose();
    if(this.hamburger) {
      this.hamburger.children.forEach((child) => {
        disposeMesh(child as Mesh);
      });
    }
    disposeMesh(this.floor.mesh);
    disposeMesh(this.wall.mesh);
    disposeObjects(...Object.values(this.floor.textures), ...Object.values(this.wall.textures));
    this.directionalLight.dispose();
  }

}
