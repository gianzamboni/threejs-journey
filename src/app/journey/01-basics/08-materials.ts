import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import RenderView from '@/app/layout/render-view';
import { DebugFPS, Debuggable } from '../exercises/debug-decorators';
import { AssetLoader } from '@/app/utils/assets-loader';

@Debuggable
export class MaterialsTest extends OrbitControlledExercise {

  public static id = 'materials';
  
  private physicalMaterial: THREE.MeshPhysicalMaterial;//THREE.MeshPhysicalMaterial;
  private geometries: THREE.BufferGeometry[];
  private meshes: THREE.Mesh[];
  private envMap: THREE.Texture;
  private loader: AssetLoader;

  constructor(view: RenderView) {
    super(view);
    this.loader = AssetLoader.getInstance();
    this.setupEnvironment();

    this.physicalMaterial = this.createMaterial();

    this.geometries = [
      new THREE.SphereGeometry(0.5, 64, 64),
      new THREE.BoxGeometry(1, 1, 1, 100, 100),
      new THREE.ConeGeometry(0.3, 0.2, 64, 128),
    ];

    this.meshes = this.geometries.map(g => new THREE.Mesh(g, this.physicalMaterial));
    this.scene.add(...this.meshes);
  }

  @DebugFPS
  frame() {
    super.frame();
  }

  private setupEnvironment() {
    this.loader.loadEnvironment('envMaps/alley_2k.hdr', (envMap) => {
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
      side: THREE.DoubleSide,
    });
  }
  async dispose() {
    super.dispose();
    this.geometries.forEach(g => g.dispose());
    this.physicalMaterial.dispose();
  }
}