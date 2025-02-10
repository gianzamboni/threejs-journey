import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import { Callable, Customizable, Debuggable } from '../exercises/debug-decorators';
import RenderView from '@/app/layout/render-view';
import gsap from 'gsap';

@Debuggable
export class DebugUITest extends OrbitControlledExercise {
  public static id = 'debug-ui';

  @Customizable('Awesome Cube', [{
      propertyPath: 'position.y',
      configuration: {
        min: -3,
        max: 3,
        step: 0.01,
        name: 'Elevation',
      }
  }, {
    propertyPath: 'visible',
    configuration: {
      name: 'Visible'
    }
  }])
  private cube: THREE.Mesh;

  @Customizable('Awesome Cube', [{
    propertyPath: 'wireframe',
    configuration: {
      name: 'Wireframe',
    }
  }, {
    propertyPath: 'color',
    isColor: true,
    configuration: {
      name: 'Color',
      onChange: 'updateMaterialColor'
    }
  }])
  private material: THREE.MeshBasicMaterial;

  private geometry: THREE.BoxGeometry;

  constructor(view: RenderView) {
    super(view);

    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.cube);
  }

  @Callable('Awesome Cube', 'Spin')
  spin() {
      gsap.to(this.cube.rotation, { duration: 1, y: this.cube.rotation.y + Math.PI * 2 });
    }

  updateMaterialColor(newColor: string) {
    this.material.color.set(newColor);
  }

  async dispose() {
    super.dispose();
    this.material.dispose();
    this.geometry.dispose();
  }
}