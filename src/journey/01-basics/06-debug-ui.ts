import * as THREE from 'three';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import { Callable, Customizable, Debuggable } from '../exercises/debug-decorators';
import RenderView from '@/layout/render-view';
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
    this.scene.remove(this.cube);
  }
}
// export class DebugUIExercise {
//   constructor(view, debugUI) {
//     this.debugOject = {
//       color: '#a778d8',
//       spin: this.spin.bind(this),
//       subdivision: 2
//     };
//   }
  
//   init() {
//     this.debugUI.update("Triangles", this.view.trianglesCount);
//     this.debugUI.update("Lines", this.view.linesCount);
//   }

//   spin() {
//     gsap.to(this.mesh.rotation, { duration: 1, y: this.mesh.rotation.y + Math.PI * 2 });
//   }

//   addGuiTweaks() {
//     cubeTweaks.add(this.debugOject, 'spin').name("Spin");
//     cubeTweaks.add(this.debugOject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
//       this.mesh.geometry.dispose();
//       this.mesh.geometry = new THREE.BoxGeometry(1, 1, 1, this.debugOject.subdivision, this.debugOject.subdivision, this.debugOject.subdivision);
//       this.updateRenderData();
//     }).name('Subdivision');
//   }

//   updateRenderData() {
//     setTimeout(() => {
//       this.debugUI.update("Triangles", this.view.trianglesCount);
//       this.debugUI.update("Lines", this.view.linesCount);
//     }, 100);

//   }
// }