import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader, loadHelmet } from "#/app/utils/assets-loader";
import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";
import * as THREE from 'three';

@Exercise('realistic-render')
@Description([
  '<strong>Renderer tweaks to get a more realistic render</strong>',
])
export class RealisticRender extends OrbitControlledExercise {

  @Customizable([
    {
      propertyPath: 'environmentIntensity',
      folderPath: 'Environment',
      settings: {
        min: 0,
        max: 10,
        step: 0.001,
        name: 'Intensity',
      }
    }
  ])
  private _scene: THREE.Scene;

  @Customizable([
    {
      propertyPath: 'toneMapping',
      folderPath: 'Tone Mapping',
      settings: {
        name: 'Algorithm',
        options: {
          No: THREE.NoToneMapping,
          Linear: THREE.LinearToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Cineon: THREE.CineonToneMapping,
          ACESFilmic: THREE.ACESFilmicToneMapping
        }
      }
    }, {
      propertyPath: 'toneMappingExposure',
      folderPath: 'Tone Mapping',
      settings: {
        name: 'Exposure',
        min: 0,
        max: 10,
        step: 0.001,
      }
    }
  ])
  private _renderer: THREE.WebGLRenderer;

  private envMap: THREE.Texture | undefined;

  private helmet: THREE.Object3D[] | undefined;



  constructor(view: RenderView) {
    super(view);
    this._scene = this.scene;
    this._scene.environmentIntensity = 1;
    this._renderer = view.renderer;

    this.loadEnvironment();
    this.loadHelmet();

    this.camera.position.set(4, 5, 4);
    this.controls.target.y = 3.5;

    this._renderer.toneMapping = THREE.ReinhardToneMapping;
    this._renderer.toneMappingExposure = 3;
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
        // Acticate shadow here
      }
    });
  }

  async dispose() {
    super.dispose();  
    this.envMap?.dispose();
  }

}
