import { DirectionalLight, ACESFilmicToneMapping, PCFSoftShadowMap, BoxGeometry, MeshStandardMaterial } from "three";
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('procedural-terrain')
export class ProceduralTerrain extends OrbitControlledExercise {

  private directionalLight: DirectionalLight;
  private board: Brush;
  
  constructor(view: RenderView) {
    super(view);

    this.loadEnvironmentMap();
    this.directionalLight = this.createDirectionalLight();
    this.board = this.createBoard();
    this.scene.add(this.directionalLight, this.board)

    this.camera.fov = 35;
    this.camera.position.set(-10, 6, -2);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    view.setRender({
      shadowMapType: PCFSoftShadowMap,
      tone: {
        mapping: ACESFilmicToneMapping,
        exposure: 1,
      }
    })
  }

  async dispose() {
  }

  private createBoard() {
    const boardfill = new Brush(new BoxGeometry(11, 2, 11));
    const boardHole = new Brush(new BoxGeometry(10, 2.1, 10));

    const evaluate = new Evaluator();
    const board = evaluate.evaluate(boardfill, boardHole, SUBTRACTION);
    board.geometry.clearGroups();
    board.material = new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.3
    })
    board.castShadow = true;
    board.receiveShadow = true;
    return board;
  }

  private createDirectionalLight() {
    const directionalLight = new DirectionalLight('#ffffff', 2)
    directionalLight.position.set(6.25, 3, 4)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 30
    directionalLight.shadow.camera.top = 8
    directionalLight.shadow.camera.right = 8
    directionalLight.shadow.camera.bottom = -8
    directionalLight.shadow.camera.left = -8
    return directionalLight;
  }

  private loadEnvironmentMap() {
    AssetLoader.getInstance()
      .loadEnvironment('env-maps/field/2k.hdr', this.scene, (environmentMap) => {
        this.scene.background = environmentMap;
        this.scene.backgroundBlurriness = 0.5;
      })
  }
}