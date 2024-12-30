import * as THREE from 'three';
import { Timer } from 'three/addons/misc/Timer.js'
import { TEXTURE_LOADER } from '../../utils/loading-manager';
import GUI from 'lil-gui';
export class HauntedHouse {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.lights = { 
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      directional: new THREE.DirectionalLight(0xffffff, 1.5),
    }

    this.timer = new Timer();

    this.material = new THREE.MeshStandardMaterial()

    this.floorTextures = {}
    this.floorTextures.color = TEXTURE_LOADER.load('/textures/floor/stony_dirt_path_diff_4k.jpg');
    this.floorTextures.arm = TEXTURE_LOADER.load('/textures/floor/stony_dirt_path_arm_4k.jpg');
    this.floorTextures.normal = TEXTURE_LOADER.load('/textures/floor/stony_dirt_path_nor_gl_4k.jpg');
    this.floorTextures.displacement = TEXTURE_LOADER.load('/textures/floor/stony_dirt_path_disp_4k.jpg');

    Object.values(this.floorTextures).forEach(texture => {
      texture.repeat.set(4,4);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    this.floorTextures.alpha = TEXTURE_LOADER.load('/textures/floor/alpha.jpg');
    this.floorTextures.color.colorSpace = THREE.SRGBColorSpace;

    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 1000, 1000), 
      new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: this.floorTextures.alpha,
        map: this.floorTextures.color,
        aoMap: this.floorTextures.arm,
        roughnessMap: this.floorTextures.arm,
        metalnessMap: this.floorTextures.arm,
        normalMap: this.floorTextures.normal,
        displacementMap: this.floorTextures.displacement,
        displacementScale: 0.1,
      })
    );
    
    this.house = {
      walls: new THREE.Mesh(new THREE.BoxGeometry(4, 2.5, 4), this.material),
      roof: new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.5, 4), this.material),
      door: new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), this.material),
    }

    this.houseGroup = new THREE.Group();

    this.bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    this.bushes = Array.from({ length: 4 }, () => new THREE.Mesh(this.bushGeometry, this.material));

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


    this.floor.rotation.x = - Math.PI * 0.5;
    Object.values(this.house).forEach(mesh => this.houseGroup.add(mesh));
    this.house.walls.position.y = 1.25;    
    this.house.roof.position.y = 2.5 + 0.75;
    this.house.roof.rotation.y = Math.PI * 0.25;
    this.house.door.position.y = 1;
    this.house.door.position.z = 2 + 0.01;

    this.bushes[0].scale.set(0.5, 0.5, 0.5);
    this.bushes[0].position.set(0.8, 0.2, 2.2);
    this.bushes[1].scale.set(0.25, 0.25, 0.25);
    this.bushes[1].position.set(1.4, 0.1, 2.1);
    this.bushes[2].scale.set(0.4, 0.4, 0.4);
    this.bushes[2].position.set(-0.8, 0.1, 2.2);
    this.bushes[3].scale.set(0.15, 0.15, 0.15);
    this.bushes[3].position.set(-1, 0.05, 2.6);

    [this.floor, this.houseGroup, ...this.bushes, this.gravesGroup].forEach(mesh => this.scene.add(mesh));
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
    this.scene.remove(this.houseGroup, this.floor, ...this.bushes, this.gravesGroup);
    this.graveGeometry.dispose();
    this.bushGeometry.dispose();
    this.houseGroup.clear();
    [this.floor, ...Object.values(this.house)].forEach(mesh => {
      mesh.geometry.dispose()
      mesh.material.dispose();
    });
    this.floorAlphaTexture.dispose();
  }
}