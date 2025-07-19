import { DirectionalLight, ACESFilmicToneMapping, PCFSoftShadowMap, BoxGeometry, MeshStandardMaterial, Mesh, PlaneGeometry, Uniform, MeshDepthMaterial, RGBADepthPacking, Color, MeshPhysicalMaterial } from "three";
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'

import { Timer } from "three/examples/jsm/Addons.js";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise, Starred } from "#/app/decorators/exercise";
import { CustomizableMetadata } from "#/app/layout/debug-ui/controller-factory";  
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { UNIFORM_CONTROLLERS } from "./controllers";
import terrainFrag from './shaders/terrain.frag';
import terrainVert from './shaders/terrain.vert';

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('procedural-terrain')
@Starred
export class ProceduralTerrain extends OrbitControlledExercise {

  private directionalLight: DirectionalLight;
  private board: Brush;
  private terrain: Mesh;
  private water: Mesh;

  @Customizable(UNIFORM_CONTROLLERS)
  private commonUniforms: Record<string, Uniform<any>> = {
    uPositionFrequency: new Uniform(0.2),
    uStrength: new Uniform(2.0),
    uWarpFrequency: new Uniform(5.0),
    uWarpStrength: new Uniform(0.5),
    uTime: new Uniform(0),
    uColorWaterDeep: new Uniform(new Color('#002b3d')),
    uColorWaterSurface: new Uniform(new Color('#66a8ff')),
    uColorSand: new Uniform(new Color('#ffe894')),
    uColorGrass: new Uniform(new Color('#85d534')),
    uColorRock: new Uniform(new Color('#bfbd8d')),
    uColorSnow: new Uniform(new Color('#ffffff')),
  }
  
  constructor(view: RenderView) {
    super(view);

   this.loadEnvironmentMap();
   this.directionalLight = this.createDirectionalLight();
   this.board = this.createBoard();
   this.terrain = this.createTerrain();
   this.water = this.createWater();
   this.scene.add(this.directionalLight, this.board, this.terrain, this.water)

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
      this.commonUniforms.uTime.value = timer.getElapsed();
  }

  async dispose() {
    disposeMesh(this.board);
    disposeMesh(this.terrain);
    disposeMesh(this.water);
  }

  private createWater() {
    const geometry = new PlaneGeometry(10, 10, 1, 1);
    const material = new MeshPhysicalMaterial({
      transmission: 0.9,
      roughness: 0.4,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotateX(-Math.PI * 0.5);
    mesh.position.y = -0.1;

    return mesh;
  }

  private createTerrain() {
    const geometry = new PlaneGeometry(10, 10, 1024, 1024);
    geometry.deleteAttribute('uv')
    geometry.deleteAttribute('normal');
    geometry.rotateX(-Math.PI * 0.5);

    const material = new CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      color: 0x85d534,
      metalness: 0,
      roughness: 0.5,
      vertexShader: terrainVert,
      fragmentShader: terrainFrag,
      uniforms: this.commonUniforms
    })

    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: MeshDepthMaterial,
      vertexShader: terrainVert,
      fragmentShader: terrainFrag,
      uniforms: this.commonUniforms,
      depthPacking: RGBADepthPacking
    });

    const terrain = new Mesh(geometry, material);
    terrain.customDepthMaterial = depthMaterial;
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

  public updateUniform(newValue: string, context: CustomizableMetadata) {
    this.commonUniforms[`u${context.property}`].value.set(new Color(newValue));
  }
  
}