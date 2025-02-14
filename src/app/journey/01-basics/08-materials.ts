import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import RenderView from '@/app/layout/render-view';
import { Callable, Customizable, DebugFPS, Debuggable } from '@/app/journey/decorators/debug';
import { AssetLoader } from '@/app/utils/assets-loader';
import { Timer } from 'three/addons/misc/Timer.js';
import { Quality } from '@/app/layout/quality-selector';

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
@Debuggable
export class MaterialsTest extends OrbitControlledExercise {

  public static id = 'materials';
  
  private loader: AssetLoader;
  private qualityconfig: QualityConfig;

  @Customizable("Material", [
    {
      propertyPath: 'metalness',
      configuration: {
        min: 0,
        max: 1,
        step: 0.0001,
        name: 'Metalness'
      }
    }, {
      propertyPath: 'roughness',
      configuration: {
        min: 0,
        max: 1,
        step: 0.0001,
        name: 'Roughness'
      }
    }, {
      propertyPath: 'transmission',
      configuration: {
        min: 0,
        max: 1,
        step: 0.0001,
        name: 'Transmission'
      }
    }, {
      propertyPath: 'ior',
      configuration: {
        min: 1,
        max: 2.5,
        step: 0.0001,
        name: 'IOR'
      }
    }, {
      propertyPath: 'thickness',
      configuration: {
        min: 0,
        max: 1,
        step: 0.0001,
        name: 'Thickness'
      }
    }
  ])
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

  @DebugFPS
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
      roughness: 0.5,
      transmission: 1,
      ior: 1.5,
      thickness: 0.5,
      side: this.qualityconfig.materialSide,
    });
  }

  @Callable('Quality', 'Low')
  public simplify() {
    this.geometries[0].dispose();
    this.geometries[2].dispose();

    this.geometries[0] = new THREE.SphereGeometry(0.5, 8, 8);
    this.geometries[2] = new THREE.TorusGeometry(0.3, 0.2, 8, 16);

    this.meshes[0].geometry = this.geometries[0];
    this.meshes[2].geometry = this.geometries[2];
    this.physicalMaterial.side = THREE.FrontSide;
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