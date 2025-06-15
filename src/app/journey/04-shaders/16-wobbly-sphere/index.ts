import { ACESFilmicToneMapping, BufferGeometry, Color, DirectionalLight, IcosahedronGeometry, Mesh, MeshDepthMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PCFSoftShadowMap, PlaneGeometry, RGBADepthPacking, Uniform } from "three";

import { Timer } from 'three/addons/misc/Timer.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import fragmentShader from "./shaders/wobble.frag";
import vertexShader from "./shaders/wobble.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


@Exercise("wobbly-sphere")
export class WobblySphere extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "material.metalness",
    folderPath: "Material",
    settings: {
      name: "Metalness",
      min: 0,
      max: 1,
      step: 0.001,
    }
  }, {
    propertyPath: "material.roughness",
    folderPath: "Material",
    settings: {
      name: "Roughness",
      min: 0,
      max: 1,
      step: 0.001,
    }
  }, {
    propertyPath: "material.transmission",
    folderPath: "Material",
    settings: {
      name: "Transmission",
      min: 0,
      max: 1,
      step: 0.001,
    }
  }, {
    propertyPath: "material.ior",
    folderPath: "Material",
    settings: {
      name: "IOR",
      min: 0,
      max: 10,
      step: 0.001,
    }
  }, {
    propertyPath: "material.thickness",
    folderPath: "Material",
    settings: {
      name: "Thickness",
      min: 0,
      max: 10,
      step: 0.001,
    }
  }, {
    propertyPath: "material.color",
    folderPath: "Material",
    type: "color",
    settings: {
      name: "Color",
      onChange: "updateMatetrialColor"
    }
  }])
  private wobble: Mesh;
  private plane: Mesh;

  @Customizable([{
    propertyPath: "uPositionFrequency.value",
    folderPath: "Animation",
    settings: {
      name: "Position Frequency",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uTimeFrequency.value",
    folderPath: "Animation",
    settings: {
      name: "Time Frequency",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uStrength.value",
    folderPath: "Animation",
    settings: {
      name: "Strength",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uWarpPositionFrequency.value",
    folderPath: "Animation",
    settings: {
      name: "Warp Position Frequency",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uWarpTimeFrequency.value",
    folderPath: "Animation",
    settings: {
      name: "Warp Time Frequency",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uWarpStrength.value",
    folderPath: "Animation",
    settings: {
      name: "Warp Strength",
      min: 0,
      max: 2,
      step: 0.001,
    }
  }, {
    propertyPath: "uColorA.value",
    folderPath: "Animation",
    type: "color",
    initialValue: "#0000ff",
    settings: {
      name: "Color A",
      onChange: "updateColorA"
    }
  }, {
    propertyPath: "uColorB.value",
    folderPath: "Animation",
    type: "color",
    initialValue: "#ff0000",
    settings: {
      name: "Color B",
      onChange: "updateColorB"
    }
  }])
  private uniforms: Record<string, Uniform>;
  private directionalLight: DirectionalLight;

  constructor(view: RenderView) {
    super(view);

    AssetLoader.getInstance().loadEnvironment("env-maps/alley/2k.hdr", this.scene, (environmentMap) => {
      this.scene.background = environmentMap;
    });

    this.uniforms = {
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

    let geometry: BufferGeometry = new IcosahedronGeometry(2.5, 256);
    geometry = mergeVertices(geometry);
    geometry.computeTangents();
    
    this.wobble = new Mesh(geometry, material);
    this.wobble.receiveShadow = true;
    this.wobble.castShadow = true;
    this.wobble.geometry = geometry;

    this.plane = new Mesh(
      new PlaneGeometry(15, 15, 15),
      new MeshStandardMaterial()
    );
    this.plane.receiveShadow = true;
    this.plane.rotation.y = Math.PI;
    this.plane.position.y = -5;
    this.plane.position.z = 5;

    this.directionalLight = new DirectionalLight('#ffffff', 3);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 2, - 2.25);
    
    const depthMaterial = new CustomShaderMaterial({
      baseMaterial: MeshDepthMaterial,
      vertexShader,
      depthPacking: RGBADepthPacking,
      uniforms: this.uniforms,
    });

    this.wobble.customDepthMaterial = depthMaterial;
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
}