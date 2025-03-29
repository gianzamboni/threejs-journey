import * as THREE from 'three';

//import {  Customizable, DebugFPS, Debuggable } from '#/app/journey/decorators/debug';
import { Timer } from 'three/addons/misc/Timer.js';

import { Customizable } from '#/app/decorators/customizable';
import { DebugFPS } from '#/app/decorators/debug';
import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import { Quality } from '#/app/layout/quality-selector';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';
import { PHYSICAL_MATERIAL_CONFIGS } from './debug-ui-configs';
import { QUALITY_CONFIG } from './quality-config';
import { QualityConfig } from './quality-config';
import { disposeObjects } from '#/app/utils/three-utils';

@Exercise('materials')
@Description(["Some objects with physicals materials. You can customize the material with the hidden ui"])
export class MaterialsTest extends OrbitControlledExercise {
  private loader: AssetLoader;
  private qualityconfig: QualityConfig;

  @Customizable(PHYSICAL_MATERIAL_CONFIGS)
  private physicalMaterial: THREE.MeshPhysicalMaterial;

  private geometries: THREE.BufferGeometry[];
  private meshes: THREE.Mesh[];
  private envMap: THREE.Texture | undefined;

  constructor(view: RenderView, quality: Quality) {
    super(view);
    this.qualityconfig = QUALITY_CONFIG[quality];

    this.loader = AssetLoader.getInstance();
    this.camera.position.set(2, 1, 3);
    this.setupEnvironment();
    this.physicalMaterial = this.createMaterial();

    this.geometries = [
      new THREE.SphereGeometry(0.5, 64, 64),
      new THREE.PlaneGeometry(1, 1, 1, 1),
      new THREE.TorusGeometry(0.3, 0.2, 64, 128),
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
      const mesh = new THREE.Mesh(geometry, this.physicalMaterial);
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
    return new THREE.MeshPhysicalMaterial({
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
    disposeObjects(this.physicalMaterial, ...this.geometries, this.scene.background as THREE.Texture);
    
    this.scene.environment?.dispose();
    this.envMap?.dispose();
  }
}