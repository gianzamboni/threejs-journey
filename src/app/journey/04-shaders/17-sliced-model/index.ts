import { ACESFilmicToneMapping, DirectionalLight, Group, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PlaneGeometry, Texture, Vector3 } from "three";

import { Timer } from 'three/addons/misc/Timer.js';
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import { DebugFPS } from "#/app/decorators/debug";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { disposeMesh } from "#/app/utils/three-utils";
import slicedFrag from './shaders/sliced.frag';
import slicedVert from './shaders/sliced.vert';

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";


@Exercise('sliced-model')
export default class SlicedModel extends OrbitControlledExercise {

  private environmentMap: Texture | undefined;

  private gearMaterials: MeshStandardMaterial;
  private slicedMaterial: CustomShaderMaterial;

  private gears: Group | undefined;
  private plane: Mesh;
  private directionalLight: DirectionalLight;

  constructor(view: RenderView) {
    super(view);

    const loader = AssetLoader.getInstance();

    loader.loadEnvironment('env-maps/factory/1k.hdr', this.scene, (environmentMap) => {
      this.environmentMap = environmentMap;
      this.scene.background = environmentMap;
      this.scene.backgroundBlurriness = 0.5;
    });

    this.gearMaterials = new MeshStandardMaterial({
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: '#858080'
    })

    this.slicedMaterial = new CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      metalness: 0.5,
      roughness: 0.25,
      envMapIntensity: 0.5,
      color: '#858080',
      vertexShader: slicedVert,
      fragmentShader: slicedFrag,
    })

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
    this.directionalLight.dispose();
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
              child.material = this.slicedMaterial;
            } else {
              child.material = this.gearMaterials;
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