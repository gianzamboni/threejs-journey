import * as THREE from 'three';
import RenderView from '@/app/layout/render-view';
//import {  Customizable, DebugFPS, Debuggable } from '@/app/journey/decorators/debug';
import { AssetLoader } from '@/app/utils/assets-loader';
import { Timer } from 'three/addons/misc/Timer.js';
import { Quality } from '@/app/layout/quality-selector';
import { Exercise } from '@/app/decorators/exercise';
import OrbitControlledExercise from '@/app/types/exercises/orbit-controlled-exercise';

type QualityConfig = {
  sphereSegments: number;
  torus: {
    radialSegments: number;
    tubularSegments: number;
  };
  materialSide: THREE.Side;
}
const QUALITY_CONFIG: Record<Quality, QualityConfig> = {
  [Quality.Low]: {
    sphereSegments: 8,
    torus: {
      radialSegments: 8,
      tubularSegments: 16,
    },
    materialSide: THREE.FrontSide,
  },
  [Quality.High]: {
    sphereSegments: 64,
    torus: {
      radialSegments: 64,
      tubularSegments: 128,
    },
    materialSide: THREE.DoubleSide,
  }
}

@Exercise('materials')
//@Debuggable
export class MaterialsTest extends OrbitControlledExercise {
  private loader: AssetLoader;
  private qualityconfig: QualityConfig;

  // @Customizable([
  //   {
  //     propertyPath: 'metalness',
  //     folderPath: 'Material',
  //     configuration: {
  //       min: 0,
  //       max: 1,
  //       step: 0.0001,
  //     }
  //   }, {
  //     propertyPath: 'roughness',
  //     folderPath: 'Material',
  //     configuration: {
  //       min: 0,
  //       max: 1,
  //       step: 0.0001,
  //     }
  //   }, {
  //     propertyPath: 'transmission',
  //     folderPath: 'Material',
  //     configuration: {
  //       min: 0,
  //       max: 1,
  //       step: 0.0001,
  //     }
  //   }, {
  //     propertyPath: 'ior',
  //     folderPath: 'Material',
  //     configuration: {
  //       min: 1,
  //       max: 2.5,
  //       step: 0.0001,
  //       name: 'IOR'
  //     }
  //   }, {
  //     propertyPath: 'thickness',
  //     folderPath: 'Material',      
  //     configuration: {
  //       min: 0,
  //       max: 1,
  //       step: 0.0001,
  //     }
  //   }
  // ])
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
      new THREE.SphereGeometry(0.5, this.qualityconfig.sphereSegments, this.qualityconfig.sphereSegments),
      new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
      new THREE.TorusGeometry(0.3, 0.2, this.qualityconfig.torus.radialSegments, this.qualityconfig.torus.tubularSegments),
    ];

    this.meshes = this.createMeshes();
    this.scene.add(...this.meshes);
  }

  //@DebugFPS
  frame(timer: Timer) {
    super.frame(timer);
    const elapsed = timer.getElapsed();

    this.meshes.forEach((mesh) => {
      mesh.rotation.y = 0.01 * elapsed;
      mesh.rotation.x = -0.15 * elapsed;
    });
  }

  private createMeshes() {
    return this.geometries.map((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, this.physicalMaterial);
      mesh.position.x = index * 1.5 - 1.5;
      return mesh;
    });
  }

  private setupEnvironment() {
    this.loader.loadEnvironment('textures/alley_2k.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = envMap;
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
    this.geometries.forEach(g => g.dispose());
    this.physicalMaterial.dispose();
    this.scene.environment?.dispose();
    (this.scene.background as THREE.Texture).dispose();
    if(this.envMap) {
      this.envMap.dispose();
    }
  }
}