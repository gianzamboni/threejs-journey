import { 
  Mesh, 
  Scene,
} from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font } from 'three/addons/loaders/FontLoader.js';

import { AssetLoader } from '#/app/services/assets-loader';
import { Matcap } from './matcap';

export interface ThreeJsTextProps {
  onCreated: () => void;
  material: Matcap;
}

export class ThreeJsText {
  private geometry?: TextGeometry;
  private mesh?: Mesh;
  private material: Matcap;


  constructor(props: ThreeJsTextProps) {
    this.material = props.material;
    AssetLoader.getInstance()
    .loadFont('fonts/helvetiker_regular.typeface.json', (font) => {
      this.createFromFont(font);
      props.onCreated();
    });
  }

  /**
   * Creates the text geometry and mesh from a font
   */
  createFromFont(font: Font): void {
    this.geometry = new TextGeometry('Hello Three.js', {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 10,
    });
    
    this.geometry.center();
    this.mesh = new Mesh(this.geometry, this.material.material);
  }

  /**
   * Adds the text mesh to a scene
   */
  addTo(scene: Scene): void {
    if (this.mesh) {
      scene.add(this.mesh);
    }
  }

  dispose(): void {
    this.geometry?.dispose();
  }
}
