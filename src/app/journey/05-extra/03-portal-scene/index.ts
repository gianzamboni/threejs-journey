import { Color, Group, Mesh, MeshBasicMaterial, ShaderMaterial, SRGBColorSpace } from "three";

import { Timer } from "three/examples/jsm/Addons.js";

import { Customizable } from "#/app/decorators/customizable";
import { Description, Exercise, Selectable, Starred } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { Fireflies } from "./fireflies";
import portalFragmentShader from "./shaders/portal.frag";
import portalVertexShader from "./shaders/portal.vert";
import portalFragmentShaderV2 from "./shaders/portal_v2.frag";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const SHADER_DICTIONARY = {
  "Smoky": portalFragmentShader,
  "Swirly": portalFragmentShaderV2,
}

export const SHADER_LIST = Object.keys(SHADER_DICTIONARY).reduce((acc: Record<string, string>, key: string) => {
  acc[key] = key;
  return acc;
}, {});

@Exercise('portal-scene')
@Starred
@Description(
  "<p>I have modelled this scene using Blender and baked it shadows into a texture</p>",
  "<p>In threeJs I used a shaders to create the portal effect and to add some fireflies</p>"
)
export class PortalScene extends OrbitControlledExercise {
 
  @Customizable([{
    type: 'color',
    settings: {
      name: 'Background Color',
      onChange: 'updateClearColor'
    }
  }])
  private clearColor: string = '#080712';


  @Customizable([{
    type: 'color',
    settings: {
      name: 'Start Color',
      onChange: 'updateStartColor'
    }
  }])
  private startColor: string = '#d8d6ff';

  @Customizable([{
    type: 'color',
    settings: {
      name: 'End Color',
      onChange: 'updateEndColor'
    }
  }])
  private endColor: string = '#000000';

  private portal: Group | undefined;

  private portalMaterial: MeshBasicMaterial;
  private lampMaterial: MeshBasicMaterial;
  private portalLight: ShaderMaterial;

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
    this.portalLight = new ShaderMaterial({
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader,
      uniforms: {
        uTime: { value: 0 },
        uStartColor: { value: new Color(this.startColor) },
        uEndColor: { value: new Color(this.endColor) },
      },
      transparent: true,
    });

    this.loadPortal();
    this.camera.position.set(4, 2, 4);

    this.fireflies = new Fireflies(renderView);
    this.fireflies.addToScene(this.scene);

    this.updateClearColor(this.clearColor);
    this.updateStartColor(this.startColor);
    this.updateEndColor(this.endColor);
  }

  frame(timer: Timer) {
    super.frame(timer);
    this.fireflies.frame(timer);
    this.portalLight.uniforms.uTime.value = timer.getElapsed();
  }

  private async loadPortal() {
    AssetLoader.getInstance().loadGLTF('https://i0hci4avyoqkwwp1.public.blob.vercel-storage.com/portal.glb', {
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

  public updateStartColor(newValue: string) {
    this.startColor = newValue;
    this.portalLight.uniforms.uStartColor.value = new Color(this.startColor);
  }

  public updateEndColor(newValue: string) {
    this.endColor = newValue;
    this.portalLight.uniforms.uEndColor.value = new Color(this.endColor);
  }

  @Selectable('Portal Effect', SHADER_LIST, "Smoky")
  public changeShader(shader: keyof typeof SHADER_DICTIONARY) {
    this.portalLight.fragmentShader = SHADER_DICTIONARY[shader];
    this.portalLight.needsUpdate = true;
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

