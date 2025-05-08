import { CubeTexture, DirectionalLight, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from "three";

import { Exercise } from "#/app/decorators/exercise";
import OrbitControlledExercise from "#/app/journey/exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";

@Exercise("modified-materials")
export class ModifiedMaterials extends OrbitControlledExercise {

    private envMap: CubeTexture;

    private textures: {
      map: Texture;
      normal: Texture;
    };

    private material: MeshStandardMaterial;

    private light: DirectionalLight;

    constructor(view: RenderView) {
        super(view);

        this.envMap = this.loadEnvMap();
        this.textures = this.loadTextures();
        this.material = this.createMaterial();
        this.light = this.createLight();

        this.loadModel();
        this.scene.add(this.light);
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
      return new MeshStandardMaterial({
        map: this.textures.map,
        normalMap: this.textures.normal,
      });
    }

    private loadModel() {
      const assetLoader = AssetLoader.getInstance();
      assetLoader.loadGLTF('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
        const mesh = gltf.scene.children[0] as Mesh;
        mesh.rotation.y = Math.PI * 0.5;
        mesh.material = this.material;
        this.scene.add(mesh);

        this.updateAllMaterials();
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
      this.textures.map.dispose();
      this.textures.normal.dispose();
      this.envMap.dispose();
    }
}
