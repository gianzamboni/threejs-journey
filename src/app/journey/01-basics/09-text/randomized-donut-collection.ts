import { 
  Mesh, 
  TorusGeometry, 
  Scene,
} from 'three';

import { Matcap } from './matcap';

export class RandomPositionedTorus extends Mesh {
  constructor(geometry: TorusGeometry, material: Matcap) {
    super(geometry, material.material);

    // Set random position
    this.position.x = (Math.random() - 0.5) * 10;
    this.position.y = (Math.random() - 0.5) * 10;
    this.position.z = (Math.random() - 0.5) * 10;
    
    // Set random rotation
    this.rotation.x = Math.random() * Math.PI;
    this.rotation.y = Math.random() * Math.PI;
    
    // Set random scale
    const scale = Math.random();
    this.scale.set(scale, scale, scale);
  }


  frame(): void {
    this.rotation.x += 0.005;
    this.rotation.y += 0.005;
  }
}

export class RandomizedDonutCollection {
  public donuts: RandomPositionedTorus[];
  private sharedGeometry: TorusGeometry;

  constructor(material: Matcap, count: number = 100) {
    this.sharedGeometry = new TorusGeometry(0.3, 0.15, 32, 64);
    this.donuts = [];
    
    for (let i = 0; i < count; i++) {
      const donut = new RandomPositionedTorus(this.sharedGeometry, material);
      this.donuts.push(donut);
    }
  }


  frame(): void {
    for (const donut of this.donuts) {
      donut.frame();
    }
  }

  addTo(scene: Scene): void {
    scene.add(...this.donuts);
  }
}
