import { DirectionalLight, ACESFilmicToneMapping, PCFSoftShadowMap, BoxGeometry, MeshStandardMaterial, Mesh, PlaneGeometry } from "three";
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'

import { Timer } from "three/examples/jsm/Addons.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import terrainFrag from './shaders/terrain.frag';
import terrainVert from './shaders/terrain.vert';

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('procedural-terrain')
export class ProceduralTerrain extends OrbitControlledExercise {

  private directionalLight: DirectionalLight;
  private board: Brush;
  private terrain: Mesh;

  constructor(view: RenderView) {
    super(view);

    this.loadEnvironmentMap();
    this.directionalLight = this.createDirectionalLight();
    this.board = this.createBoard();
    this.terrain = this.createTerrain();
    this.scene.add(this.directionalLight, this.board, this.terrain)

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

  @DebugFPS
  frame(timer: Timer): void {
      super.frame(timer);
  }

  async dispose() {
    disposeMesh(this.board);
    disposeMesh(this.terrain);
  }

  private createTerrain() {
    const geometry = new PlaneGeometry(10, 10, 1024, 1024);
    geometry.rotateX(-Math.PI * 0.5);

    const material = new CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      color: 0x85d534,
      metalness: 0,
      roughness: 0.5,
      vertexShader: terrainVert,
      fragmentShader: terrainFrag
    })

    const terrain = new Mesh(geometry, material);
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    return terrain
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