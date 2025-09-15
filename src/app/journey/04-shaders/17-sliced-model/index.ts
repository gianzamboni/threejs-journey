import { ACESFilmicToneMapping, DirectionalLight, DoubleSide, Group, LinearSRGBColorSpace, Mesh, MeshDepthMaterial, MeshStandardMaterial, PCFSoftShadowMap, PlaneGeometry, RGBADepthPacking, Texture, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { Customizable } from "#/app/decorators/customizable";
import { DebugFPS } from "#/app/decorators/debug";
import { Description, Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import customColorSpaceFrag from './shaders/custom_colorspace.frag';
import slicedFrag from './shaders/sliced.frag';
import slicedVert from './shaders/sliced.vert';

import { EnvironmentMap } from "../../common/environment-map";
import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

@Exercise('sliced-model')
@Description(
  '<p>Demostration of a model sliced in real time using a custom shader material.</p>',
)
export default class SlicedModel extends OrbitControlledExercise {

  private environmentMap: Texture | undefined;

  private materials: {
    gear: MeshStandardMaterial;
    sliced: CustomShaderMaterial;
    slicedDepth: CustomShaderMaterial;
  }

  private gears: Group | undefined;
  private plane: Mesh;
  private directionalLight: DirectionalLight;

  private envMap: EnvironmentMap;

  @Customizable([{
    propertyPath: 'uSliceStart.value',
    settings: {
      min: - Math.PI,
      max: Math.PI,
      step: 0.01,
    }
  }, {
    propertyPath: 'uSliceArc.value',
    settings: {
      min: 0,
      max: Math.PI * 2,
      step: 0.01,
    }
  }])

  private uniforms: {
    uSliceStart: { value: number },
    uSliceArc: { value: number },
  }

  constructor(view: RenderView) {
    super(view);

    this.envMap = new EnvironmentMap('env-maps/factory/1k.hdr');
    this.envMap.addTo(this.scene);
    this.scene.backgroundBlurriness = 0.5;

    this.uniforms = {
      uSliceStart: { value: 1.75 },
      uSliceArc: { value: 1.25 },
    }

    this.materials = this.createMaterials();
    this.loadModel();
    this.plane = this.createPlane();
    this.directionalLight = this.createDirectionalLight();

    this.camera.fov = 35;
    this.camera.position.set(-5, 5, 12);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.camera.updateProjectionMatrix();

    this.view.setRender({
      shadowMapType: PCFSoftShadowMap,
      tone: {
        mapping: ACESFilmicToneMapping,
        exposure: 1,
      },
      outputColorSpace: LinearSRGBColorSpace,
    })
    this.scene.add(this.plane, this.directionalLight);
  }


  @DebugFPS
  frame(timer: Timer): void {
    super.frame(timer);

    if (this.gears) {
      this.gears.rotation.y = timer.getElapsed() * 0.1;
    }
  }

  async dispose() {
    this.environmentMap?.dispose();
    if (this.gears) {
      this.gears.traverse((child) => {
        if (child instanceof Mesh) {
          disposeMesh(child);
        }
      });
      this.gears.clear();
      this.gears = undefined;
    }
    disposeMesh(this.plane);
    this.materials.sliced.dispose();
    this.materials.slicedDepth.dispose();
    this.materials.gear.dispose();
    this.directionalLight.dispose();
  }

  private createMaterials() {
    const materialProps = {
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: '#858080'
    }

    const customMaterialProps = {
      vertexShader: slicedVert,
      fragmentShader: slicedFrag,
      side: DoubleSide, 
      uniforms: this.uniforms,
      patchMap: {
        csm_Slice: {
            '#include <colorspace_fragment>': customColorSpaceFrag
        }
      },
    }

    const gearMaterial = new MeshStandardMaterial(materialProps);
    
    const slicedMaterial = new CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      ...materialProps,
      ...customMaterialProps,
    })

    const slicedDepthMaterial = new CustomShaderMaterial({
      baseMaterial: MeshDepthMaterial,
      ...customMaterialProps,
      depthPacking: RGBADepthPacking,
    })

    return {
      gear: gearMaterial,
      sliced: slicedMaterial,
      slicedDepth: slicedDepthMaterial,
    }
  }
  
  private createPlane() {
    const plane = new Mesh(
      new PlaneGeometry(10, 10, 10),
      new MeshStandardMaterial({ color: '#aaaaaa' })
    )
    plane.receiveShadow = true
    plane.position.x = - 4
    plane.position.y = - 3
    plane.position.z = - 4
    plane.lookAt(new Vector3(0, 0, 0))

    return plane;
  }

  private loadModel() {
    AssetLoader.getInstance().loadGLTF('models/gears.glb', {
      onLoad: (gltf) => {
        this.gears = gltf.scene;

        this.gears.children.forEach((child) => {
          if (child instanceof Mesh) {
            if(child.name === 'outerHull') {
              child.material = this.materials.sliced;
              child.customDepthMaterial = this.materials.slicedDepth;
            } else {
              child.material = this.materials.gear;
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.gears);
      },
      useDraco: true,
    });
  }

  private createDirectionalLight() {
    const directionalLight = new DirectionalLight('#ffffff', 4)
    directionalLight.position.set(6.25, 3, 4)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 30
    directionalLight.shadow.normalBias = 0.05
    directionalLight.shadow.camera.top = 8
    directionalLight.shadow.camera.right = 8
    directionalLight.shadow.camera.bottom = -8
    directionalLight.shadow.camera.left = -8

    return directionalLight;
  }
}