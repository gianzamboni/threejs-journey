import { 
  Mesh, 
  MeshMatcapMaterial,
  Scene,
} from 'three';

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font } from 'three/addons/loaders/FontLoader.js';

export interface ThreeJsTextProps {
  font: Font;
  material: MeshMatcapMaterial;
}

export class ThreeJsText {
  private geometry?: TextGeometry;
  private mesh?: Mesh;
  private material: MeshMatcapMaterial;


  constructor(props: ThreeJsTextProps) {
    this.material = props.material;
    this.createFromFont(props.font);
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
    this.mesh = new Mesh(this.geometry, this.material);
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
