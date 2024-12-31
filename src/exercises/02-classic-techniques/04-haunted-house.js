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
    this.geometry = new THREE.BoxGeometry(4, 2.5, 4, 1, 1);
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
    this.geometry = this.generatePyramid();

    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.y = 2.5;
    this.mesh.rotation.y = Math.PI * 0.25;
  }

  generatePyramid() {
    const geometry = new THREE.BufferGeometry();
    console.log(geometry.attributes)
    const radius = 3.25;
    const height = 1.5;

    const vertices = new Float32Array(54);
    const uvCoords = new Float32Array(36);

    const point = [0, height, 0];
    const basePoints = []
    for(let i = 0; i < 4; i++) {
      const angle = Math.PI * i * 0.5;
      basePoints.push([Math.cos(angle)*radius, 0, Math.sin(angle)*radius]);

    }

    /* Caras laterales */
    for(let i = 0; i < 4; i++) {
      const index_v = i * 9; 
      vertices.set(basePoints[i], index_v);
      vertices.set(point, index_v + 3);
      vertices.set(basePoints[(i + 1) % 4], index_v + 6);
      const xDisplacement = Math.random() * 0.5;
      const yDisplacement = Math.random() * 0.5;
      uvCoords.set([
        0 + xDisplacement, 
        0 + yDisplacement, 
        0.25 + xDisplacement, 
        0.5 + yDisplacement, 
        0.5 + xDisplacement, 
        0 + yDisplacement], i * 6);
    }

    /* Base */
    for(let i = 0; i < 2; i++) {
      const index_v = 36 + i * 9;
      vertices.set(basePoints[i*2], index_v);
      vertices.set(basePoints[i*2 + 1], index_v + 3);
      vertices.set(basePoints[(i*2 + 3) % 4], index_v + 6);
      uvCoords.set([0, 0, 0.25, 0.5, 0.5, 0], 24 + i * 6);
    }

    const vbufferAtrribute = new THREE.BufferAttribute(vertices, 3);
    const uvBufferAttribute = new THREE.BufferAttribute(uvCoords, 2);
    geometry.setAttribute('position', vbufferAtrribute);
    geometry.setAttribute('uv', uvBufferAttribute);

    return geometry;
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

class Door extends SceneObject {
  constructor() {

  }

  dispose() {
    
  }
}
class House extends SceneObject {
  constructor() {
    super();
    this.children = [
     // new Walls(),
     // new Roof(),
     new Door(),
    ];

    this.door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), this.material);

    this.mesh = new THREE.Group();
    this.children.forEach(object => object.addTo(this.mesh));
    this.mesh.add(this.door);
    
    this.door.position.y = 1;
    this.door.position.z = 2 + 0.01;
  }

  dispose(scene) {
    this.mesh.clear();
    this.children.forEach(object => object.dispose(scene));
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

    this.children = [
      //new Floor(),
      new House(),
    ];

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

    this.children.forEach(mesh => mesh.addTo(this.scene));
    //[...this.bushes, this.gravesGroup].forEach(mesh => this.scene.add(mesh));

    this.axisHelper = new THREE.AxesHelper(50);
    this.scene.add(this.axisHelper);
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
    this.children.forEach(object => {
      object.removeFrom(this.scene);
      object.dispose();
    });
    this.scene.remove(...this.bushes, this.gravesGroup);
    this.graveGeometry.dispose();
    this.bushGeometry.dispose();
  }
}