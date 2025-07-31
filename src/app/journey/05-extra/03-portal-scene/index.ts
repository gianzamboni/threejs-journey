import { Group, Mesh, MeshBasicMaterial, SRGBColorSpace } from "three";

import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('portal-scene')
export class PortalScene extends OrbitControlledExercise {

  private portal: Group | undefined;

  private portalMaterial: MeshBasicMaterial;
  private lampMaterial: MeshBasicMaterial;
  private portalLight: MeshBasicMaterial;

  constructor(renderView: RenderView) {
    super(renderView);

    const texture = AssetLoader.getInstance().loadTexture('textures/portal_baked.jpg');
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
    this.portalMaterial = new MeshBasicMaterial({ map: texture });

    this.lampMaterial = new MeshBasicMaterial({ color: 0xeeff00 });
    this.portalLight = new MeshBasicMaterial({ color: 0x6864FF });

    this.loadPortal();
    this.camera.position.set(4, 2, 4);
  }

  private async loadPortal() {
    AssetLoader.getInstance().loadGLTF('models/portal.glb', {
      useDraco: true,
      onLoad: gltf => {
          
        gltf.scene.traverse(child => {
          if (child instanceof Mesh) {
            if (child.name.startsWith('Lamp')) {
              child.material = this.lampMaterial;
            } else if (child.name === 'Circle') {
              child.material = this.portalLight;
            } else {
              child.material = this.portalMaterial;
            }
          }
        });

        this.portal = gltf.scene;
        this.scene.add(this.portal);
      }
    });
  }

  async dispose() {
    await super.dispose();

    if (this.portal) {
      this.portal.children.forEach(child => {
        if (child instanceof Mesh) {
          child.geometry.dispose();
        }
      });
    }

    this.portalMaterial.map?.dispose();
    this.portalMaterial.dispose();
  }
}

