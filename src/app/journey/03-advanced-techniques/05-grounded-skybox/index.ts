import {
  Mesh,
  Group,
  Scene,
  TorusKnotGeometry,
  MeshStandardMaterial,
  Texture
} from "three";

import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { ENV_CONTROLLERS } from "./debug-ui.config";

import { EnvironmentMap } from "../../common/environment-map";

@Exercise("grounded-skybox")
@Description("<p>Demo of a correctly positioned object with a skybox.</p>")
export class GroundedSkyboxTest extends OrbitControlledExercise {

  private torusKnot: Mesh;

  private helmet: Group | undefined;

  private skybox: GroundedSkybox | undefined;

  private environmentMap: EnvironmentMap;

  @Customizable(ENV_CONTROLLERS)
  public _scene: Scene;

  constructor(view: RenderView) {
    super(view);

    this._scene = this.scene;

    this.torusKnot = this.createTorusKnot();

    this.loadHelmetModel();

    this.environmentMap = new EnvironmentMap('env-maps/field/2k.hdr');
    this.environmentMap.addTo(this.scene, {
      callback: this.addSkybox.bind(this)
    });

    this.scene.add(this.torusKnot);

    this.controls.target.y = 3.5;
    this.camera.position.set(6, 6, 6);

    this.scene.environmentIntensity = 1;
    this.scene.backgroundBlurriness = 0;
    this.scene.backgroundIntensity = 1;
  }

  createTorusKnot() {
    const geometry = new TorusKnotGeometry(1, 0.4, 100, 16);
    const material = new MeshStandardMaterial({ roughness: 0.3, metalness: 1, color: 0xaaaaaa });
    const mesh = new Mesh(geometry, material);
    mesh.position.y = 4;
    mesh.position.x = -4;
    return mesh;
  }

  loadHelmetModel() {
    AssetLoader.getInstance()
      .loadModel('/models/FlightHelmet/glTF/FlightHelmet.gltf', 
        (model) => {
        this.helmet = model;
        this.helmet.scale.set(10, 10, 10);
        this.scene.add(this.helmet);
      });
  }

  addSkybox(texture: Texture) {
    this.skybox = new GroundedSkybox(texture, 15, 70);
    this.skybox.position.y = 15;
    this.scene.add(this.skybox);
  }

  async dispose() {
    await super.dispose();

    if (this.environmentMap) {
      this.environmentMap.dispose();
    }

    disposeMesh(this.torusKnot);

    if (this.helmet) {
      this.helmet.children.forEach((child) => {
        disposeMesh(child as Mesh);
      });
    }

    if(this.skybox) {
      disposeMesh(this.skybox);
    }
  }
}
