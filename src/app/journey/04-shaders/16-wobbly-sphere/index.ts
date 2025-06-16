import { ACESFilmicToneMapping, BufferGeometry, Color, DirectionalLight, IcosahedronGeometry, Mesh, MeshDepthMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PCFSoftShadowMap, PlaneGeometry, RGBADepthPacking, Uniform } from "three";

import { Timer } from 'three/addons/misc/Timer.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import { CSS_CLASSES } from "#/theme";
import { ANIMATION_CONTROLLERS, MATERIAL_CONTROLLERS } from "./controllers";
import fragmentShader from "./shaders/wobble.frag";
import vertexShader from "./shaders/wobble.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


@Exercise("wobbly-sphere")
@Description(`<p>A wobbly sphere using custom shaders.</p>`,
  `<p class='${CSS_CLASSES.light_text}'>Although similar to the <strong class='${CSS_CLASSES.text}'>Raging Sea</strong> demo, in this case I am extending the materials provided by Three.js intstead of implementing my own from scratch.</p>`)
export class WobblySphere extends OrbitControlledExercise {

  @Customizable(MATERIAL_CONTROLLERS)
  private wobble: Mesh;
  private plane: Mesh;

  @Customizable(ANIMATION_CONTROLLERS)
  private uniforms: Record<string, Uniform>;
  private directionalLight: DirectionalLight;

  constructor(view: RenderView) {
    super(view);
    this.loadEnvironment();
    
    this.uniforms = this.createUniforms();
    this.wobble = this.createWobble();
    this.plane = this.createPlane();
    this.directionalLight = this.createDirectionalLight();
    
    this.camera.fov = 35;
    this.camera.position.set(13, - 3, - 5);
    this.camera.updateProjectionMatrix();
    
    this.scene.add(this.wobble, this.plane, this.directionalLight);

    view.setRender({
      shadowMapType: PCFSoftShadowMap,
      tone: {
        mapping: ACESFilmicToneMapping,
        exposure: 1,
      }
    })
  }

  @DebugFPS
  public frame(timer: Timer) {
    super.frame(timer);
    this.uniforms.uTime.value = timer.getElapsed();
  }

  public updateMatetrialColor(newColor: string) {
    (this.wobble.material as MeshPhysicalMaterial).color.set(new Color(newColor));
  }

  public updateColorA(newColor: string) {
    console.log('updateColorA', newColor);
    this.uniforms.uColorA.value.set(new Color(newColor));
  }

  public updateColorB(newColor: string) {
    this.uniforms.uColorB.value.set(new Color(newColor));
  }

  async dispose() {
    await super.dispose();
    disposeMesh(this.wobble);
    disposeMesh(this.plane);
  }

  private loadEnvironment() {
    AssetLoader.getInstance().loadEnvironment("env-maps/alley/2k.hdr", this.scene, (environmentMap) => {
      this.scene.background = environmentMap;
    });
  }

  private createDirectionalLight() {
    const light = new DirectionalLight('#ffffff', 3);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.far = 15;
    light.shadow.normalBias = 0.05;
    light.position.set(0.25, 2, - 2.25);
    return light;
  }

  private createPlane() {
    const plane = new Mesh(
      new PlaneGeometry(15, 15, 15),
      new MeshStandardMaterial()
    );

    plane.receiveShadow = true;
    plane.rotation.y = Math.PI;
    plane.position.y = -5;
    plane.position.z = 5;

    return plane;
  }

  private createUniforms() {
    return {
      uTime: new Uniform(0),
      uPositionFrequency: new Uniform(0.5),
      uTimeFrequency: new Uniform(0.4),
      uStrength: new Uniform(0.3),
      uWarpPositionFrequency: new Uniform(0.38),
      uWarpTimeFrequency: new Uniform(0.12),
      uWarpStrength: new Uniform(1.7),
      uColorA: new Uniform(new Color("#0000ff")),
      uColorB: new Uniform(new Color("#ff0000")),
    }
  }

  private createWobble() {
    const material = new CustomShaderMaterial({
      baseMaterial: MeshPhysicalMaterial,
      metalness: 0,
      roughness: 0.5,
      color: '#ffffff',
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
    })


    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: MeshDepthMaterial,
      vertexShader,
      depthPacking: RGBADepthPacking,
      uniforms: this.uniforms,
    });

    let geometry: BufferGeometry = new IcosahedronGeometry(2.5, 256);
    geometry = mergeVertices(geometry);
    geometry.computeTangents();
    
    this.wobble = new Mesh(geometry, material);
    this.wobble.receiveShadow = true;
    this.wobble.castShadow = true;
    this.wobble.customDepthMaterial = depthMaterial;

    return this.wobble;
  }
}