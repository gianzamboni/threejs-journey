import { 
  ACESFilmicToneMapping, 
  CubeTexture, 
  DirectionalLight, 
  Material, 
  Mesh, 
  MeshDepthMaterial, 
  MeshStandardMaterial, 
  PCFSoftShadowMap, 
  PlaneGeometry, 
  RGBADepthPacking, 
  SRGBColorSpace, 
  Texture 
} from "three";

import { Timer } from "three/addons/misc/Timer.js";

import { Description, Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import beginVertexExtension from './begin_vertex_ext.glsl';
import beginNormalVertexExtension from './beginnormal_vertex_ext.glsl';
import commonExtension from './common_ext.glsl';

@Exercise("twisted-head")
@Description("<p>Twisting a predined model using GLSL and extending the default shaders of Three.js</p>")
export class ModifiedMaterials extends OrbitControlledExercise {

  private envMap: CubeTexture;

  private textures: {
    map: Texture;
    normal: Texture;
  };

  private material: MeshStandardMaterial;
  private depthMaterial: MeshDepthMaterial;

  private light: DirectionalLight;

  private plane: Mesh;

  private uniforms = {
    uTime: { value: 0 },
  };

  constructor(view: RenderView) {
    super(view);

    this.envMap = this.loadEnvMap();
    this.textures = this.loadTextures();
    this.material = this.createMaterial();

    this.depthMaterial = this.createDepthMaterial();

    this.plane = this.createPlane();
    this.light = this.createLight();

    this.loadModel();
    this.camera.position.set(8, 1, -8);
    this.scene.add(this.light, this.plane);
    this.view.setRender({
      shadowMapType: PCFSoftShadowMap,
      tone: {
        mapping: ACESFilmicToneMapping,
        exposure: 1,
      },
    });
  }

  public frame(timer: Timer) {
    super.frame(timer);
    const elapsed = timer.getElapsed();
    this.uniforms.uTime.value = elapsed;
  }

  private createDepthMaterial() {
    const material = new MeshDepthMaterial({
      depthPacking: RGBADepthPacking,
    });

    this.extendMaterial(material);
    return material;
  }

  private createPlane() {
    const plane = new Mesh(new PlaneGeometry(15, 15, 15), new MeshStandardMaterial());
    plane.rotation.y = Math.PI;
    plane.position.y = -5
    plane.position.z = 6;
    return plane;
  }

  private loadEnvMap() {
    const envMap = AssetLoader.getInstance().loadCubeTexture('/env-maps/street', 'jpg');
    this.scene.background = envMap;
    this.scene.environment = envMap;
    return envMap;
  }

  private loadTextures() {
    const assetLoader = AssetLoader.getInstance();
    const map = assetLoader.loadTexture('/models/LeePerrySmith/color.jpg');
    map.colorSpace = SRGBColorSpace;

    const normal = assetLoader.loadTexture('/models/LeePerrySmith/normal.jpg');

    return {
      map,
      normal,
    }
  }

  private createMaterial() {
    const material = new MeshStandardMaterial({
      map: this.textures.map,
      normalMap: this.textures.normal,
    });

    this.extendMaterial(material, [
      ["#include <beginnormal_vertex>", beginNormalVertexExtension],
    ]);

    return material;
  }

  private extendMaterial(material: Material, customReplacements: [string, string][] = []) {

    material.onBeforeCompile = (shader) => {
      [
        ["#include <common>", commonExtension],
        ["#include <begin_vertex>", beginVertexExtension],
        ...customReplacements,
      ].forEach(([search, replace]) => {
        shader.vertexShader = shader.vertexShader.replace(
          search,
          replace
        )
      });
      shader.uniforms.uTime = this.uniforms.uTime;

    }
  }

  private loadModel() {
    const assetLoader = AssetLoader.getInstance();
    assetLoader.loadGLTF('/models/LeePerrySmith/LeePerrySmith.glb', {
      onLoad: (gltf) => {
        const mesh = gltf.scene.children[0] as Mesh;
        mesh.rotation.y = Math.PI * 0.5;
        mesh.material = this.material;
        mesh.customDepthMaterial = this.depthMaterial;
        this.scene.add(mesh);
        this.updateAllMaterials();
    },
    useDraco: true
  });
  }

  private createLight() {
    const light = new DirectionalLight(0xffffff, 3);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.far = 15;
    light.shadow.normalBias = 0.05;
    light.position.set(0.25, 2, -2.25);
    return light;
  }

  private updateAllMaterials() {
    this.scene.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.envMapIntensity = 1;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  async dispose() {
    super.dispose();
    disposeMesh(this.plane);
    this.textures.map.dispose();
    this.textures.normal.dispose();
    this.envMap.dispose();
  }
}
