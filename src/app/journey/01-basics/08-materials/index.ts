import { 
  MeshPhysicalMaterial,
  BufferGeometry,
  Mesh,
  Texture,
  SphereGeometry,
  PlaneGeometry,
  TorusGeometry
} from 'three';

//import {  Customizable, DebugFPS, Debuggable } from '#/app/journey/decorators/debug';
import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import { Quality } from '#/app/layout/quality-selector';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/services/assets-loader';
import { disposeObjects } from '#/app/utils/three-utils';
import { PHYSICAL_MATERIAL_CONFIGS } from './debug-ui-configs';
import { QUALITY_CONFIG } from './quality-config';
import { QualityConfig } from './quality-config';

@Exercise('materials')
@Description(
  "<p><strong>Some objects with physical materials.</strong></p>",
  "<p>You can customize the material with the hidden ui</p>"
)
export class MaterialsTest extends OrbitControlledExercise {
  private loader: AssetLoader;
  private qualityconfig: QualityConfig;

  @Customizable(PHYSICAL_MATERIAL_CONFIGS)
  private physicalMaterial: MeshPhysicalMaterial;

  private geometries: BufferGeometry[];
  private meshes: Mesh[];
  private envMap: Texture | undefined;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.qualityconfig = QUALITY_CONFIG[quality];

    this.loader = AssetLoader.getInstance();
    this.camera.position.set(2, 1, 3);
    this.setupEnvironment();
    this.physicalMaterial = this.createMaterial();

    this.geometries = [
      new SphereGeometry(0.5, 64, 64),
      new PlaneGeometry(1, 1, 1, 1),
      new TorusGeometry(0.3, 0.2, 64, 128),
    ];

    this.meshes = this.createMeshes();
    this.scene.add(...this.meshes);
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    const elapsed = timer.getElapsed();

    for(const mesh of this.meshes) {
      mesh.rotation.y = 0.01 * elapsed;
      mesh.rotation.x = -0.15 * elapsed;
    }
  }

  private createMeshes() {
    return this.geometries.map((geometry, index) => {
      const mesh = new Mesh(geometry, this.physicalMaterial);
      mesh.position.x = index * 1.5 - 1.5;
      return mesh;
    });
  }

  private setupEnvironment() {
    this.loader.loadEnvironment('env-maps/alley/2k.hdr', this.scene, (envMap) => {
      this.scene.background = envMap;
      this.envMap = envMap;   
    });
  }

  private createMaterial() {
    return new MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.1,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5,
      side: this.qualityconfig.materialSide,
    });
  }
  
  async dispose() {
    super.dispose();
    disposeObjects(this.physicalMaterial, ...this.geometries, this.scene.background as Texture);
    
    this.scene.environment?.dispose();
    this.envMap?.dispose();
  }
}