import { 
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  Raycaster,
  ReinhardToneMapping,
  Vector3,
} from "three";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { HelpPoint } from "./help-point";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('mixing-webgl-and-html')
@Description(
  '<p>Here, I have added some html elements that moves along with the camera and merge with the scene.</p>'
)
export class MixingHtml extends OrbitControlledExercise {  
  private points: HelpPoint[] = [];

  private raycaster: Raycaster;

  constructor(view: RenderView) {
    super(view);
    this.loadEnvironmentMap();
    this.loadModel();

    this.view.setRender({
      shadowMapType: PCFShadowMap,
      tone: {
        mapping: ReinhardToneMapping,
        exposure: 1.5,
      }
    })
    this.camera.position.set(4, 1, -4);

    this.raycaster = new Raycaster();

    this.createHelpPoints();
  }

  private createHelpPoints() {
    this.points.push(
      new HelpPoint(
        '1',
        'Front and top screen with HUD aggregating terrain and battle informations.',
        new Vector3(1.2, 0.3, -0.6)
      ),
      new HelpPoint(
        '2',
        'Ventilation with air purifier and detection of environment toxicity.',
        new Vector3(0.25, 0.8, -1.6)
      ),
      new HelpPoint(
        '3',
        'Cameras supporting night vision and heat vision with automatic adjustment.',
        new Vector3(1.3, -1.3, -0.7)
      )
    );

    this.points.forEach(point => {
      document.body.appendChild(point.element);
    });
  }

  @DebugFPS
  frame(timer: Timer) {
    super.frame(timer);

    this.points.forEach(point => {
      const pointPosition = point.position.clone().project(this.camera);
      point.screenPosition.set(pointPosition.x, pointPosition.y);
      point.update();

      this.raycaster.setFromCamera(point.screenPosition, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if(intersects.length === 0) {
        point.show();
      } else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(this.camera.position);
        if(intersectionDistance < pointDistance) {
          point.hide();
        } else {
          point.show();
        }
      }
    });
  }

  private loadEnvironmentMap() {
    const environmentMap = AssetLoader.getInstance().loadCubeTexture('env-maps/street', "jpg");
    this.scene.background = environmentMap;
    this.scene.environment = environmentMap;
  }

  private loadModel() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
      gltf.scene.scale.set(2, 2, 2)
      gltf.scene.rotation.y = Math.PI * 0.5
      this.scene.add(gltf.scene);
      this.updateAllMaterials();
    });
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if(child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMapIntensity = 2.5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  async dispose() {
    await super.dispose();
  }
}
