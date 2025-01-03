import GUI from 'lil-gui';
import * as THREE from 'three';
import { CustomizableLight } from '../../utils/customizable-light';

export class LightsExercise {
  constructor(view) {
    this.view = view;
    this.gui = new GUI();
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.lights = [
      new CustomizableLight("AmbientLight", {
        color: "#ffffff",
        intensity: 0.2,
      }),
      new CustomizableLight("DirectionalLight", {
        color: "#00fffc",
        intensity: 0.9,
      },{
        position: { x: 1, y: 0, z: 0},
        showHelper: true
      }),
      new CustomizableLight("HemisphereLight", {
        color: "#ff0000",
        groundColor: "#0000ff",
        intensity: 0.9,
      },{
        showHelper: true
      }),
      new CustomizableLight("PointLight", {
        color: "#ff9000",
        intensity: 1.5,
        distance: 0.5,
        decay: 2,
      },{
        position: { x: 1, y: -0.5, z: 1 },
        showHelper: true
      }),
      new CustomizableLight("RectAreaLight", {
        color: "#4e00ff",
        intensity: 6,
        width: 1,
        height: 1,
      },{
        position: { x: -1.5, y:  0, z: 1.5},
        lookAt: { x: 0, y: 0, z: 0 },
        showHelper: true
      }),
      new CustomizableLight("SpotLight", {
        color: "#78ff00",
        intensity: 4.5,
        distance: 0,
        angle: Math.PI * 0.1,
        penumbra: 0.25,
        decay: 1,
      },{
        position: { x:0, y: 2, z: 3},
        targetPosition: { x: -0.75, y: 0, z: 0 },
        showHelper: true
      })
    ]

    this.material = new THREE.MeshStandardMaterial();
    this.material.roughness = 0.4;
    
    this.objects = [
      new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), this.material),
      new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), this.material),
      new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), this.material),
    ]

    this.objects[0].position.x = -1.5;
    this.objects[2].position.x = 1.5;

   
    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), this.material);
    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.65;
    this.scene.add(this.plane);
  }

  init() {
    this.view.setCamera({ 
      position: { x: 2, y: 1, z: 3 }, 
      lookAt: { x: 0, y: 0, z: 0 } 
    });
    this.scene.add(...this.objects);
    this.lights.forEach(light => {
      light.addControls(this.gui);
      light.addTo(this.scene)
      if(light.type === "SpotLight") {
        this.scene.add(light.light.target);
      }
    });
    this.view.show(this.scene);
    this.view.setTick(() => this.animationFrame());

  }

  animationFrame() {
    const elapsedTime = this.clock.getElapsedTime();
    this.lights.forEach(light => light.update());
    this.objects.forEach(object => {
      object.rotation.y = 0.1 * elapsedTime;
      object.rotation.x = 0.15 * elapsedTime;
    });    
  };

  async dispose() {
    this.clock.stop();
    this.scene.remove(this.plane);
    this.plane.geometry.dispose();
    this.objects.forEach(object => {
      this.scene.remove(object)
      object.geometry.dispose();
    });
    this.material.dispose();
    this.lights.forEach(light => {
      light.dispose(this.scene);
    });
    this.gui.destroy();
  }
}
