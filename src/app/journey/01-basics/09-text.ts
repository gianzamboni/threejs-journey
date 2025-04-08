import { 
  Mesh, 
  TorusGeometry, 
  MeshMatcapMaterial, 
  Texture,
  SRGBColorSpace,
} from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Timer } from 'three/addons/misc/Timer.js';

import { Description, Exercise } from '#/app/decorators/exercise';
import OrbitControlledExercise from '#/app/journey/exercises/orbit-controlled-exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from "#/app/utils/assets-loader";
import { disposeObjects } from '#/app/utils/three-utils';

@Exercise('text-3d')
@Description("<strong>A bunch of donuts and a text in 3D.</strong>")
export class Text3D extends OrbitControlledExercise {
  private loader: AssetLoader;

  private matcapTexture: Texture;
  private material: MeshMatcapMaterial;

  private donuts: {
    geometry: TorusGeometry;
    meshes: Mesh[];
  }

  private text: {
    geometry?: TextGeometry;
    mesh?: Mesh;
  };
  
  constructor(view: RenderView) {
    super(view);
    this.camera.position.set(3,0,6);
    this.camera.lookAt(0,0,0);

    this.loader = AssetLoader.getInstance();
    this.matcapTexture = this.loader.loadTexture('textures/matcaps/8.png');
    this.matcapTexture.colorSpace = SRGBColorSpace;

    this.material = new MeshMatcapMaterial({
      matcap: this.matcapTexture,
    });

    this.donuts = this.generateDonuts();
    this.scene.add(...this.donuts.meshes);
    this.text = {};
    this.generateText();
  }

  frame(timer: Timer): void {
    super.frame(timer);
    for(const donut of this.donuts.meshes) {
      donut.rotation.x += 0.005;
      donut.rotation.y += 0.005;
    }
  }

  generateDonuts() {
    const geometry = new TorusGeometry(0.3, 0.15, 32, 64);
    const donuts = []
    for(let i = 0; i < 100; i++) {
      const donut = new Mesh(geometry, this.material);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      donuts.push(donut);
    }
    return {
      geometry,
      meshes: donuts
    };
  }

  generateText() {
    this.loader.loadFont('fonts/helvetiker_regular.typeface.json', (font) => {
      this.text.geometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 10
      });
      this.text.geometry.center();
      this.text.mesh = new Mesh(this.text.geometry, this.material);
      this.scene.add(this.text.mesh);
    });
  }
  
  async dispose() {
    await super.dispose();
    disposeObjects(this.material, this.matcapTexture, this.donuts.geometry);
    this.text.geometry?.dispose();
  }
}