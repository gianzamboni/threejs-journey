import GUI from 'lil-gui';
import * as THREE from 'three';
import { AnimationLoop } from '../../utils/animation-loop';
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js';

const MIN_MAX = {
  angle: { min: 0, max: Math.PI / 2, step: 0.01 },
  decay: { min: 0, max: 2, step: 0.01 },
  distance: { min: 0, max: 1, step: 0.001 },
  height: { min: 0, max: 1, step: 0.01 },
  intensity: { min: 0, max: 6, step: 0.01 },
  penumbra: { min: 0, max: 1, step: 0.01 },
  width: { min: 0, max: 1, step: 0.01 },
  x: { min: -5, max: 5, step: 0.01 },
  y: { min: -5, max: 5, step: 0.01 },
  z: { min: -5, max: 5, step: 0.01 },
}

class CustomLight {
  constructor(type, params, config = {}) {
    this.type = type;
    this.on = true;
    this.params = params;
    this.config = config;
    this.lightControls = [];

    this.light = new THREE[type](...Object.values(this.params));

    if (this.config.position) {
      this.setPosition(this.config.position);
    }

    if (this.config.lookAt) {
      this.setLookAt(this.config.lookAt);
    }

    if (this.config.targetPosition) {
      this.setTargetPosition(this.config.targetPosition);
    }

    this.helper = null;
    switch (type) {
      case "DirectionalLight":
        this.helper = new THREE.DirectionalLightHelper(this.light, 0.2);
        break;
      case "HemiSphereLight":
        this.helper = new THREE.HemisphereLightHelper(this.light, 0.2);
        break;
      case "PointLight":
        this.helper = new THREE.PointLightHelper(this.light, 0.2);
        break;
      case "SpotLight":
        this.helper = new THREE.SpotLightHelper(this.light);
        break;
      case "RectAreaLight":
        this.helper = new RectAreaLightHelper(this.light);
        break;
      default:
    }
  }

  setPosition(newPosition) {
    this.light.position.x = newPosition.x;
    this.light.position.y = newPosition.y;
    this.light.position.z = newPosition.z;
  }

  setLookAt(newLookAt) {
    const newTarget = new THREE.Vector3(
      newLookAt.x,
      newLookAt.y,
      newLookAt.z
    );
    this.light.lookAt(newTarget);
  }

  setTargetPosition(newPosition) {
    this.light.target.position.x = newPosition.x;
    this.light.target.position.y = newPosition.y;
    this.light.target.position.z = newPosition.z;
  }

  addControls(gui) {
    this.lightSettingFolder = gui.addFolder(this.type);
    this.createOnOffControl();
    this.createLightParamsControls();
    this.createExtraControls();
  }

  createPositionalControl(param, onChange) {
    const positionFolder = this.lightSettingFolder.addFolder(param);
    positionFolder.close();
    ["x", "y", "z"].forEach((axis) => {
      const minMax = MIN_MAX[axis];

      const control = positionFolder
        .add(this.config[param], axis)
        .min(minMax.min)
        .max(minMax.max)
        .step(minMax.step)
        .name(axis)
        .onChange(() => {
          onChange(axis);
        });

      this.lightControls.push(control);
    });
  }

  createExtraControls() {
    if (this.config.position !== undefined) {
      this.createPositionalControl('position', (axis) => {
        this.light.position[axis] = this.config.position[axis];
      });
    }

    if (this.config.lookAt !== undefined) {
      this.createPositionalControl('lookAt', () => {
        const newTarget = new THREE.Vector3(
          this.config.lookAt.x,
          this.config.lookAt.y,
          this.config.lookAt.z
        );
        this.light.lookAt(newTarget);
      });
    }

    if (this.config.targetPosition !== undefined) {
      this.createPositionalControl('targetPosition', (axis) => {
        this.light.target.position[axis] = this.config.targetPosition[axis];
      });
    }
    
  }
  createOnOffControl() {
    this.lightSettingFolder.add(this, 'on').name('On/Off').onChange(() => {
      this.light.visible = this.on;
      this.lightControls.forEach(control => {
        if(this.on === false) {
         control.disable();
        } else {
          control.enable();
        }
      });
    });
  }

  createColorControl(param) {
    const control = this.lightSettingFolder
      .addColor(this.params, param)
      .name(param)
      .onChange(() => {
        this.light[param].set(this.params[param]);
      });

    this.lightControls.push(control);
  }

  createNumericControl(param) {
    const minMax = MIN_MAX[param];
    const control = this.lightSettingFolder
      .add(this.params, param)
      .min(minMax.min)
      .max(minMax.max)
      .step(minMax.step)
      .name(param)
      .onChange(() => {
        this.light[param] = this.params[param];
    });
    this.lightControls.push(control);
  }

  createLightParamsControls() {
    const params = this.params;
    Object.keys(params).forEach(param => {
      if (typeof params[param] === "string") {
        this.createColorControl(param);
      } else {
        this.createNumericControl(param);
      }
    });
  }

  addTo(scene) {
    scene.add(this.light);
    if (this.helper) {
      scene.add(this.helper);
    }
  }

  dispose(scene) {
    if (this.helper) {
      scene.remove(this.helper);
      this.helper.dispose();
    }

    if(this.light.target) {
      scene.remove(this.light.target);
      this.light.target.clear();
    }

    scene.remove(this.light);
    this.light.dispose();
  }
}

export class LightsExercise {
  constructor(view) {
    this.view = view;
    this.gui = new GUI();
    this.scene = new THREE.Scene();
    this.animation = new AnimationLoop(() => this.animationFrame());
    this.clock = new THREE.Clock();
    this.lights = [
      new CustomLight("AmbientLight", {
        color: "#ffffff",
        intensity: 0.2,
      }),
      new CustomLight("DirectionalLight", {
        color: "#00fffc",
        intensity: 0.9,
      },{
        position: { x: 1, y: 0, z: 0}
      }),
      new CustomLight("HemisphereLight", {
        color: "#ff0000",
        groundColor: "#0000ff",
        intensity: 0.9,
      }),
      new CustomLight("PointLight", {
        color: "#ff9000",
        intensity: 1.5,
        distance: 0.5,
        decay: 2,
      },{
        position: { x: 1, y: -0.5, z: 1 },
      }),
      new CustomLight("RectAreaLight", {
        color: "#4e00ff",
        intensity: 6,
        width: 1,
        height: 1,
      },{
        position: { x: -1.5, y:  0, z: 1.5},
        lookAt: { x: 0, y: 0, z: 0 }
      }),
      new CustomLight("SpotLight", {
        color: "#78ff00",
        intensity: 4.5,
        distance: 0,
        angle: Math.PI * 0.1,
        penumbra: 0.25,
        decay: 1,
      },{
        position: { x:0, y: 2, z: 3},
        targetPosition: { x: -0.75, y: 0, z: 0 }
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
    this.view.toggleOrbitControls(true);
    this.scene.add(...this.objects);
    this.lights.forEach(light => {
      light.addControls(this.gui);
      light.addTo(this.scene)
      if(light.type === "SpotLight") {
        this.scene.add(light.light.target);
      }
    });
    this.view.show(this.scene);
    this.animation.start();

  }

  animationFrame() {
    const elapsedTime = this.clock.getElapsedTime();
    this.lights.forEach(light => {
      if(light.type === "SpotLight") {
        light.helper.update();
      }
    });

    this.objects.forEach(object => {
      object.rotation.y = 0.1 * elapsedTime;
      object.rotation.x = 0.15 * elapsedTime;
    });
    
    this.view.render(this.scene);
  };

  async dispose() {
    await this.animation.stop();
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
