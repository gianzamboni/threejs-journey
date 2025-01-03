import * as THREE from "three";
import { TEXTURE_LOADER } from "../../utils/loading-manager";
import GUI from "lil-gui";

export class BakedShadow {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.lights = {
      ambient: new THREE.AmbientLight(0xffffff, 1),
      directional: new THREE.DirectionalLight(0xffffff, 1.5),
      spot: new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3),
      point: new THREE.PointLight(0xffffff, 2.7),
    }

    this.material = new THREE.MeshStandardMaterial();
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    );


    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    );

    this.simpleBakedShadow = TEXTURE_LOADER.load('/textures/bakedShadows/simpleShadow.jpg'); 
    this.sphereShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        alphaMap: this.simpleBakedShadow,
      })
    );
  }

  init() {
    this.lights.directional.position.set(2, 2, -1);
    this.lights.spot.position.set(0, 2, 2);
    this.lights.point.position.set(-1, 1, 0);

    Object.values(this.lights).forEach((light) => this.scene.add(light));

    this.material.roughness = 0.7;

    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.5;

    this.sphereShadow.rotation.x = -Math.PI * 0.5;
    this.sphereShadow.position.y = this.plane.position.y + 0.01;

    this.scene.add(this.sphere, this.plane, this.sphereShadow);

    this.view.setCamera({
      position: { x: 3, y: 1, z: 3 },
      lookAt: { x: 0, y: 0, z: 0 }
    });
    this.view.toggleOrbitControls(true);
    this.view.show(this.scene);
    this.view.setTick(this.animate.bind(this));
  }

  dispose() {
    this.clock.stop();
    [this.sphere, this.plane, this.sphereShadow].forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.simpleBakedShadow.dispose();
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    this.sphere.position.x = Math.cos(elapsedTime) * 1.5;
    this.sphere.position.z = Math.sin(elapsedTime) * 1.5;
    this.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    this.sphereShadow.position.x = this.sphere.position.x;
    this.sphereShadow.position.z = this.sphere.position.z;
    this.sphereShadow.material.opacity = (1 - this.sphere.position.y)*0.5;
  }
}