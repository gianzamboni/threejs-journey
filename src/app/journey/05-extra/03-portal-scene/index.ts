import { Group, Mesh, MeshBasicMaterial, SRGBColorSpace } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { Fireflies } from "./fireflies";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('portal-scene')
export class PortalScene extends OrbitControlledExercise {
 
  @Customizable([{
    type: 'color',
    settings: {
      name: 'Background Color',
      onChange: 'updateClearColor'
    }
  }])
  private clearColor: string = '#080712';

  private portal: Group | undefined;

  private portalMaterial: MeshBasicMaterial;
  private lampMaterial: MeshBasicMaterial;
  private portalLight: MeshBasicMaterial;

  @Customizable([{
    propertyPath: 'material.uniforms.uSize.value',
    folderPath: 'Fireflies',
    settings: {
      min: 10,
      max: 500,
      step: 1,
    }
  }])
  private fireflies: Fireflies;

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

    this.fireflies = new Fireflies(renderView);
    this.fireflies.addToScene(this.scene);

    this.updateClearColor(this.clearColor);
  }


  frame(timer: Timer) {
    super.frame(timer);
    this.fireflies.frame(timer);
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

  public updateClearColor(newValue: string) {
    this.clearColor = newValue;
    this.view.setRender({
      clearColor: this.clearColor
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
    this.fireflies.dispose();
  }
}

