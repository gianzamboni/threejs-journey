import { 
  Mesh,
  Group,
  Texture,
  Scene,
  WebGLCubeRenderTarget,
  CubeCamera,
  TorusKnotGeometry,
  MeshStandardMaterial,
  TorusGeometry,
  MeshBasicMaterial,
  Color,
  FloatType,
  SRGBColorSpace,
  EquirectangularReflectionMapping
} from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { HELMET_URL } from "#/app/utils/tests/models-urls";
import { disposeMesh } from "#/app/utils/three-utils";

@Exercise("real-time-enviroment-map")
@Description("<p>Real-time enviroment map. This means that the reflections are calculated in real time.</p>",
  '<p>The scene shows a torus knot (a three.js primitive) and a <a href="http://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet" target="_blank">flight helmet</a> model provided by KhronosGroup.</p>'
)
export class RealTimeEnviromentMap extends OrbitControlledExercise {

  private torusKnot: Mesh;

  private helmet: Group | undefined;
  private holyDonut: Mesh;

  private envMap: Texture;

  public _scene: Scene;

  private cubeRenderTarget: WebGLCubeRenderTarget;
  private cubeCamera: CubeCamera;

  constructor(view: RenderView) {
    super(view);

    this._scene = this.scene;

    this.torusKnot = this.createTorusKnot();
    this.holyDonut = this.createHolyDonut();
    this.loadHelmetModel();

    this.envMap = this.loadBackgroundTexture();

    this.scene.add(this.torusKnot, this.holyDonut);

    this.controls.target.y = 3.5;
    this.camera.position.set(6, 6, 6);

    this.scene.backgroundBlurriness = 0;
    this.scene.backgroundIntensity = 1;

    this.cubeRenderTarget = new WebGLCubeRenderTarget(256, {	
      type: FloatType,
    });

    this.cubeCamera = new CubeCamera(0.1, 100, this.cubeRenderTarget);
    this.cubeCamera.layers.set(1);

    this.scene.environment = this.cubeRenderTarget.texture;
  }

  createTorusKnot() {
    const geometry = new TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa });
    const mesh = new Mesh(geometry, material);
    mesh.position.y = 4;
    mesh.position.x = -4;
    return mesh;
  }

  createHolyDonut() {
    const geometry = new TorusGeometry(8, 0.5);
    const material = new MeshBasicMaterial({ color: new Color(10, 4, 2) });
    const mesh = new Mesh(geometry, material);
    mesh.position.y = 3.5;
    mesh.layers.set(1);
    return mesh;
  }

  loadHelmetModel() {
    AssetLoader.getInstance()
      .loadModel(HELMET_URL, 
        (group) => {
          this.helmet = group;
          this.helmet.scale.set(10, 10, 10);
          this.scene.add(this.helmet);
        }
      );
  }

  loadBackgroundTexture() {
    const loader = AssetLoader.getInstance();
    const map = loader.loadTexture('env-maps/blockade-skylab/kitchen.jpg');
    map.colorSpace = SRGBColorSpace;
    map.mapping = EquirectangularReflectionMapping;
    this.scene.background = map;
    return map;
  }

  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);
    this.holyDonut.rotation.x = Math.sin(timer.getElapsed());
    this.cubeCamera.update(this.view.renderer, this.scene);
  }

  async dispose() {
    await super.dispose();
    this.cubeRenderTarget.dispose();
    this.envMap.dispose();
    disposeMesh(this.torusKnot, this.holyDonut);
    if (this.helmet) {
      this.helmet.children.forEach((child) => {
        disposeMesh(child as Mesh);
      });
    }
  }
}
