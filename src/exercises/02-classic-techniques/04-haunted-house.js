import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js'
import { TEXTURE_LOADER } from '../../utils/loading-manager';
import { screenResolutionName } from '../../utils/utils';

const textureMaps = {
  color: 'diff',
  normal: 'nor_gl',
  displacement: 'disp',
  arm: 'arm',
}

function loadTexturesMaps(filePrefix, mapTypes) {
  const resolution = screenResolutionName();
  const textures = {};
  mapTypes.forEach(mapType => {
    textures[mapType] = TEXTURE_LOADER.load(`/textures/${filePrefix}_${textureMaps[mapType]}_${resolution}.jpg`);
  });

  textures.color.colorSpace = THREE.SRGBColorSpace;

  return textures;
}
class SceneObject {
  addTo(scene) {
    scene.add(this.mesh);
  }

  removeFrom(scene) {
    scene.remove(this.mesh);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    Object.values(this.textures).forEach(texture => texture.dispose());
  }
}

class Floor extends SceneObject {
  constructor() {
    super();
    this.geometry = new THREE.PlaneGeometry(20, 20, 1000, 1000);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = - Math.PI * 0.5;
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      transparent: true,
      alphaMap: this.textures.alpha,
      map: this.textures.color,
      aoMap: this.textures.arm,
      roughnessMap: this.textures.arm,
      metalnessMap: this.textures.arm,
      normalMap: this.textures.normal,
      displacementMap: this.textures.displacement,
      displacementScale: 0.1,
    });
  }

  loadTextures() {
    const textures = loadTexturesMaps('floor/stony_dirt_path', 
      ['color', 'normal', 'displacement', 'arm']
    );
    
    ['color', 'arm', 'normal', 'displacement'].forEach(key => {
      textures[key].repeat.set(4, 4);
      textures[key].wrapS = THREE.RepeatWrapping;
      textures[key].wrapT = THREE.RepeatWrapping;
    });

    textures.alpha = TEXTURE_LOADER.load('/textures/floor/alpha.jpg');

    return textures;
  }
}

class Walls extends SceneObject{
  constructor() {
    super();
    this.geometry = new THREE.BoxGeometry(4, 2.5, 4, 1000, 1000);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 1.25;
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.textures.color,
      aoMap: this.textures.arm,
      roughnessMap: this.textures.arm,
      metalnessMap: this.textures.arm,
      normalMap: this.textures.normal,
    });
  }

  loadTextures() {
    const textures = loadTexturesMaps('wood/castle_brick_broken_06', ['color', 'normal', 'arm']);
    return textures;
  }
}

class Roof extends SceneObject {
  constructor() {
    super();
    this.geometry = new THREE.ConeGeometry(3.5, 1.5, 4);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.y = 2.5 + 0.75;
    this.mesh.rotation.y = Math.PI * 0.25;
  }

  loadTextures() {
    const textures = loadTexturesMaps('roof/roof_slates_02', ['color', 'normal', 'arm']);

    ['color', 'normal', 'arm'].forEach(key => {
      textures[key].repeat.set(3,1);
      textures[key].wrapS = THREE.RepeatWrapping;
      textures[key].wrapT = THREE.RepeatWrapping;
    });
    
    textures.color.colorSpace = THREE.SRGBColorSpace;
    return textures;
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.textures.color,
      aoMap: this.textures.arm,
      roughnessMap: this.textures.arm,
      metalnessMap: this.textures.arm,
      normalMap: this.textures.normal,
    });
    
  }
};

class House extends SceneObject {
  constructor() {
    super();
    this.walls = new Walls();
    this.roof = new Roof();
    this.door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), this.material);

    this.mesh = new THREE.Group();
    [this.walls, this.roof].forEach(object => object.addTo(this.mesh));
    this.mesh.add(this.door);
    
    this.door.position.y = 1;
    this.door.position.z = 2 + 0.01;
  }

  dispose(scene) {
    this.mesh.clear();
    [this.walls, this.roof].forEach(object => object.dispose(scene));
    this.door.geometry.dispose();
    this.door.material.dispose();
  }
}

export class HauntedHouse {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.lights = { 
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      directional: new THREE.DirectionalLight(0xffffff, 1.5),
    }

    this.timer = new Timer();

    this.floor = new Floor();
    this.house = new House();

    this.bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    this.bushes = Array.from({ length: 4 }, () => new THREE.Mesh(this.bushGeometry));

    this.gravesGroup = new THREE.Group();
    this.graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);

    for(let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
 
      const grave = new THREE.Mesh(this.graveGeometry, this.material);
      this.gravesGroup.add(grave);

      grave.position.x = Math.sin(angle) * radius;
      grave.position.z = Math.cos(angle) * radius;
      grave.position.y = Math.random() * 0.4;

      ['x', 'y', 'z'].forEach(axis => {
        grave.rotation[axis] = (Math.random() - 0.5)*0.4;
      });      

    }
    
  }

  init() {
    this.view.setCamera({
      position: { x: 4, y: 2, z: 5 },
      lookAt: { x: 0, y: 0, z: 0 }
    })
    
    Object.values(this.lights).forEach(light => this.scene.add(light));
    this.lights.directional.position.set(3, 2, -8);

    this.bushes[0].scale.set(0.5, 0.5, 0.5);
    this.bushes[0].position.set(0.8, 0.2, 2.2);
    this.bushes[1].scale.set(0.25, 0.25, 0.25);
    this.bushes[1].position.set(1.4, 0.1, 2.1);
    this.bushes[2].scale.set(0.4, 0.4, 0.4);
    this.bushes[2].position.set(-0.8, 0.1, 2.2);
    this.bushes[3].scale.set(0.15, 0.15, 0.15);
    this.bushes[3].position.set(-1, 0.05, 2.6);

    [this.floor, this.house].forEach(mesh => mesh.addTo(this.scene));
    [...this.bushes, this.gravesGroup].forEach(mesh => this.scene.add(mesh));
    this.view.toggleOrbitControls();
    this.view.show(this.scene);
  }

  animate() {
    this.timer.update();
    const elaptsedTime = this.timer.getElapsedTime();
  }

  dispose() {
    this.timer.dispose();
    Object.values(this.lights).forEach(light => this.scene.remove(light));
    [this.floor, this.house].forEach(object => {
      object.removeFrom(this.scene);
      object.dispose();
    });
    this.scene.remove(...this.bushes, this.gravesGroup);
    this.graveGeometry.dispose();
    this.bushGeometry.dispose();
  }
}