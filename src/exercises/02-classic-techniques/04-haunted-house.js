import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js'
import { TEXTURE_LOADER } from '../../utils/loading-manager';
import { Sky } from 'three/addons/objects/Sky.js'
import { randomBetween, randomSign } from '../../utils/utils.js';
import { PathTracer } from '../../utils/path-tracer';
import GUI from 'lil-gui';

const textureMaps = {
  color: 'diff',
  normal: 'nor_gl',
  displacement: 'disp',
  arm: 'arm',
  roug: 'roughness',
  ao: 'ao',
}

function loadTexturesMaps(filePrefix, mapTypes) {
  const textures = {};
  mapTypes.forEach(mapType => {
    textures[mapType] = TEXTURE_LOADER.load(`/textures/${filePrefix}_${textureMaps[mapType]}_1k.jpg`);
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
    this.geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = - Math.PI * 0.5;
    this.mesh.receiveShadow = true;
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
    const textures = loadTexturesMaps('floor/stony_dirt_path', ['color', 'normal', 'displacement', 'arm']);
    
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
    this.geometry = new THREE.BoxGeometry(4, 2.5, 4, 100, 100, 100);
    this.textures = loadTexturesMaps('wood/castle_brick_broken_06', ['color', 'normal', 'arm']);
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 1.25;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
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
}

class Roof extends SceneObject {
  constructor() {
    super();
    this.radius = 3.25;
    this.height = 1.5;
    this.geometry = this.generatePyramid();

    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.y = 2.5;
    this.mesh.rotation.y = Math.PI * 0.25;
    this.mesh.castShadow = true;
  }

  generatePyramid() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(54);
    const uvCoords = new Float32Array(36);

    const [topPoint, basePoints] = this.generateVertices();
    this.generateSideFaces(vertices, uvCoords, topPoint, basePoints);
    this.generateBaseFaces(vertices, uvCoords, basePoints);

    const vbufferAtrribute = new THREE.BufferAttribute(vertices, 3);
    const uvBufferAttribute = new THREE.BufferAttribute(uvCoords, 2);
    geometry.setAttribute('position', vbufferAtrribute);
    geometry.setAttribute('uv', uvBufferAttribute);
    geometry.computeVertexNormals();
    return geometry;
  }

  generateVertices() {
    const topPoint = [0, this.height, 0];
    const basePoints = []
    for(let i = 0; i < 4; i++) {
      const angle = Math.PI * i * 0.5;
      basePoints.push([Math.cos(angle)*this.radius, 0, Math.sin(angle)*this.radius]);
    }
    return [topPoint, basePoints];
  }
  
  generateSideFaces(vertices, uvCoords, topPoint, basePoints) {
    for(let i = 0; i < 4; i++) {
      const index_v = i * 9; 
      vertices.set(basePoints[i], index_v);
      vertices.set(topPoint, index_v + 3);
      vertices.set(basePoints[(i + 1) % 4], index_v + 6);
      const xDisplacement = randomBetween(0, 0.5);
      const yDisplacement = randomBetween(0, 0.5);
      uvCoords.set([
        0 + xDisplacement, 
        0 + yDisplacement, 
        0.25 + xDisplacement, 
        0.5 + yDisplacement, 
        0.5 + xDisplacement, 
        0 + yDisplacement], i * 6);
    }
  }

  generateBaseFaces(vertices, uvCoords, basePoints) {
    for(let i = 0; i < 2; i++) {
      const index_v = 36 + i * 9;
      vertices.set(basePoints[i*2], index_v);
      vertices.set(basePoints[i*2 + 1], index_v + 3);
      vertices.set(basePoints[(i*2 + 3) % 4], index_v + 6);
      uvCoords.set([0, 0, 0.25, 0.5, 0.5, 0], 24 + i * 6);
    }
  }

  loadTextures() {
    const textures = loadTexturesMaps('roof/roof_slates_02', ['color', 'normal', 'arm']);

    ['color', 'normal', 'arm'].forEach(key => {
      textures[key].repeat.set(3,1);
      textures[key].wrapS = THREE.RepeatWrapping;
      textures[key].wrapT = THREE.RepeatWrapping;
    });
    
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
    super();
    this.geometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);
    this.textures = this.loadTextures();
    this.material = this.generateMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 1;
    this.mesh.position.z = 2 + 0.01;
  }

  loadTextures() {
    const textures = {};
    ['alpha', 'ambientOcclusion', 'color', 'height', 'metalness', 'normal', 'roughness'].forEach(mapType => {
      textures[mapType] = TEXTURE_LOADER.load(`/textures/door/${mapType}.jpg`);
    });

    textures.color.colorSpace = THREE.SRGBColorSpace;
    textures.height.colorSpace = THREE.SRGBColorSpace;
    return textures;
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      color: "#b3b3b3",
      alphaMap: this.textures.alpha,
      aoMap: this.textures.ambientOcclusion,
      displacementBias: -0.04,
      displacementMap: this.textures.height,
      displacementScale: 0.1,
      map: this.textures.color,
      metalnessMap: this.textures.metalness,
      normalMap: this.textures.normal,
      roughnessMap: this.textures.roughness,
      transparent: true,  
    });
  }
}
class House extends SceneObject {
  constructor() {
    super();
    this.children = [
     new Walls(),
     new Roof(),
     new Door(),
    ];

    this.mesh = new THREE.Group();
    this.children.forEach(object => object.addTo(this.mesh));  
    
    this.doorLight = new THREE.PointLight(0xff7d46, 5);
    this.doorLight.position.set(0, 2.2, 2.5);
    this.mesh.add(this.doorLight);
  }

  dispose(scene) {
    this.mesh.clear();
    this.children.forEach(object => object.dispose());
    this.doorLight.dispose();
  }
}

class Bushes extends SceneObject {
  constructor() {
    super();
    this.geometry = new THREE.SphereGeometry(1, 100, 100);
    this.textures = loadTexturesMaps('bushes/scattered_leaves_008', ['color', 'normal', 'ao', 'displacement', 'roug']);
    this.material = this.generateMaterial();
    this.mesh = new THREE.Group();
    this.bushes = this.generateBushes();
  }

  generateBushes() {
    const bushes = [];
    for(let i = 0; i < 4; i++) {
      const bush = new THREE.Mesh(this.geometry, this.material);
      bush.rotation.x = -0.75;
      bushes.push(bush);
      this.mesh.add(bush);
    }

    bushes[0].scale.set(0.4, 0.4, 0.4);
    bushes[0].position.set(1, 0.2, 2.2);
    bushes[1].scale.set(0.15, 0.15, 0.15);
    bushes[1].position.set(1.6, 0.1, 2.1);
    bushes[2].scale.set(0.3, 0.3, 0.3);
    bushes[2].position.set(-0.8, 0.1, 2.2);
    bushes[3].scale.set(0.1, 0.1, 0.1);
    bushes[3].position.set(-1, 0.05, 2.55);
    return bushes;
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      color: "#dfdfdf",
      map: this.textures.color,
      aoMap: this.textures.ao,
      roughness: 2,
      roughnessMap: this.textures.roug,
      normalMap: this.textures.normal,
      displacementMap: this.textures.displacement,
      displacementScale: 0.5,
      metalness: 0,
    });
  }
}

export class Graves extends SceneObject {
  constructor() {
    super();
    this.geometry = new THREE.BoxGeometry(0.6, 0.8, 0.2, 100, 100, 100);
    this.textures = loadTexturesMaps('graves/plastered_stone_wall', ['color', 'normal', 'arm', 'displacement']);
    this.material = this.generateMaterial();
    this.mesh = new THREE.Group();
    this.graves = this.generateGraves();
  }

  generateGraves() {
    const graves = [];
    for(let i = 0; i < 30; i++) {
      const grave = new THREE.Mesh(this.geometry, this.material);
      this.setRandomPosition(grave);
      this.setRandomRotation(grave);

      grave.castShadow = true;
      grave.receiveShadow = true;

      graves.push(grave);
      this.mesh.add(grave);
    }
    return graves;
  }

  setRandomRotation(grave) {
    ['x', 'y', 'z'].forEach(axis => {
      grave.rotation[axis] = randomBetween(-0.2, 0.2);
    });
  }

  setRandomPosition(grave) {
    const angle = randomBetween(0, Math.PI * 2);
    const radius = randomBetween(3.5, 6);

    grave.position.x = Math.sin(angle) * radius;
    grave.position.z = Math.cos(angle) * radius;
    grave.position.y = randomBetween(0, 0.4);
  }

  loadTextures() {
    const textures = loadTexturesMaps('graves/plastered_stone_wall', ['color', 'normal', 'arm', 'displacement']);
    Object.values(textures).forEach(texture => {
      texture.repeat.set(0.3, 0.4); 
    });  
  }

  generateMaterial() {
    return new THREE.MeshStandardMaterial({
      map: this.textures.color,
      aoMap: this.textures.arm,
      roughnessMap: this.textures.arm,
      metalnessMap: this.textures.arm,
      normalMap: this.textures.normal,
      displacementMap: this.textures.displacement,
      displacementScale: 0.025,
      displacementBias: -0.015,
    });
  }
}

export class Ghosts extends SceneObject {
  constructor() {
    super();
    this.mesh = new THREE.Group();
    this.ghosts = [];
    this.minRadius = 4;

    ['#8800ff', '#ff0088', '#ff0000'].forEach((color) => {
      const ghost = this.generateGhost(color);
      this.ghosts.push(ghost);
      this.mesh.add(ghost.light);
      //this.mesh.add(ghost.helper);
      //this.mesh.add(ghost.tracer.mesh);
    });
  }

  generateGhost(color) {
    const ghost = {
      light: new THREE.PointLight(color, 6),
      pacing: randomSign() * randomBetween(0.0001, 0.3),
      displacement: randomBetween(0, Math.PI * 2),
      radius: randomBetween(this.minRadius, 6),
      multipliers: [randomSign() * randomBetween(0, 3), randomSign() * randomBetween(0, 4)],
    };

    this.generateGhostWobblingConstants(ghost);
    this.setupGhostShadows(ghost);
    //ghost.helper = new THREE.PointLightHelper(ghost.light, 0.2);
    //ghost.tracer = new PathTracer(ghost.light, color);
    return ghost;
  }

  setupGhostShadows(ghost) {
    ghost.light.castShadow = true;
    ghost.light.shadow.mapSize.width = 256
    ghost.light.shadow.mapSize.height = 256
    ghost.light.shadow.camera.far = 10
  }

  generateGhostWobblingConstants(ghost) {
    ['X', 'Z'].forEach(axis => {
      ghost[`wobbling${axis}`] = {
        amplitude: randomBetween(0, ghost.radius - this.minRadius),
        speed: randomBetween(0, 10),
      }
    });
  }

  animate(elapsedTime) {
    this.ghosts.forEach((ghost) => {
      const { displacement, light, multipliers, pacing, radius, wobblingX, wobblingZ } = ghost;
      const angle = elapsedTime * pacing;
      light.position.x = Math.cos(angle + displacement) * (radius + Math.cos(angle*wobblingX.speed)*wobblingX.amplitude);
      light.position.z = Math.sin(angle + displacement) * (radius + Math.sin(angle*wobblingZ.speed)*wobblingZ.amplitude);
      light.position.y = Math.sin(angle + displacement) * Math.sin(angle * multipliers[0]) * Math.sin(angle * multipliers[1]);
      //ghost.tracer.update();
    })
  }

  dispose() {
    this.mesh.clear();
    this.ghosts.forEach(ghost => {
      ghost.light.dispose();
      //ghost.helper.dispose();
      //ghost.tracer.dispose();
    });
  }
}
export class HauntedHouse {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.lights = this.createLights();
    this.timer = new Timer();
    this.ghosts = new Ghosts();
    this.fog = new THREE.FogExp2("#04343f", 0.1);//new THREE.Fog('#ff0000', 1, 13);
      
    this.children = [
      new Floor(),
      new House(),
      new Bushes(),
      new Graves(),
      this.ghosts,
    ];
  }

  createLights() {
    const lights = {
      ambient: new THREE.AmbientLight(0x86cdff, 0.275),
      directional: this.createDirectionLight(),
      sky: this.createSkyLight(),
    }
    return lights;
  }

  createSkyLight() {
    const sky = new Sky();
    sky.material.uniforms['turbidity'].value = 10
    sky.material.uniforms['rayleigh'].value = 3
    sky.material.uniforms['mieCoefficient'].value = 0.1
    sky.material.uniforms['mieDirectionalG'].value = 0.95
    sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

    sky.scale.set(100, 100, 100);
    return sky;
  }

  createDirectionLight() {
    const light = new THREE.DirectionalLight(0x86cdff, 1);
    light.position.set(3, 2, -8);
    light.castShadow = true;
    light.shadow.mapSize.width = 256
    light.shadow.mapSize.height = 256
    light.shadow.camera.top = 8
    light.shadow.camera.right = 8
    light.shadow.camera.bottom = - 8
    light.shadow.camera.left = - 8
    light.shadow.camera.near = 1
    light.shadow.camera.far = 20
    return light;
  }

  init() {
    this.view.setCamera({
      position: { x: 5, y: 2, z: 7 },
      lookAt: { x: 0, y: 0, z: 0 }
    })
    
    this.scene.fog = this.fog; 
    Object.values(this.lights).forEach(light => this.scene.add(light));
    this.children.forEach(mesh => mesh.addTo(this.scene));

    this.view.enableShadows();
    this.view.show(this.scene);
  }

  animation() {
    this.timer.update();
    const elapsedTime = this.timer.getElapsed();
    this.ghosts.animate(elapsedTime);
  }

  dispose() {
    this.timer.dispose();
    Object.values(this.lights).forEach(light => this.scene.remove(light));
    this.lights.directional.dispose();
    this.lights.sky.material.dispose();
    this.lights.sky.geometry.dispose();
    this.children.forEach(object => {
      object.removeFrom(this.scene);
      object.dispose();
    });
  }
}