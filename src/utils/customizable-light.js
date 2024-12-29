import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

const MIN_MAX = {
  angle: { min: 0, max: Math.PI / 2, step: 0.01 },
  decay: { min: 0, max: 2, step: 0.01 },
  distance: { min: 0, max: 10, step: 0.001 },
  height: { min: 0, max: 1, step: 0.01 },
  intensity: { min: 0, max: 6, step: 0.01 },
  penumbra: { min: 0, max: 1, step: 0.01 },
  width: { min: 0, max: 1, step: 0.01 },
  x: { min: -5, max: 5, step: 0.01 },
  y: { min: -5, max: 5, step: 0.01 },
  z: { min: -5, max: 5, step: 0.01 },
}

export class CustomizableLight {
  constructor(type, params, config = {}) {
    this.type = type;
    this.on = true;
    this.params = params;
    this.config = config;
    this.showLightHelper = config.showHelper ?? false;
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

    if (this.helper) {
      this.helper.visible = this.showLightHelper;
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

      if(this.helper) {
        this.helper.visible = this.on && this.showLightHelper;
      }
    });
    
    if(this.helper) {
      this.lightSettingFolder.add(this, 'showLightHelper').name('Show Helper').onChange(() => {
        this.helper.visible = this.showLightHelper;
      });
    }
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

  update() {
    if (this.light.type === "SpotLight" && this.helper) {
      this.helper.update();
    }
  }

  hideHelper() {
    if (this.helper) {
      this.helper.visible = false;
    }
  }

  enableShadows() {
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
    this.light.shadow.camera.near = 1;
    this.light.shadow.camera.far = 6;
  }

  get shadow() {
    return this.light.shadow;
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
