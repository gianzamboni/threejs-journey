import GUI from 'lil-gui';
import * as THREE from 'three';
import { CustomizableLight } from '../../utils/customizable-light';

export class ShadowExercise {
  constructor(view) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.gui = new GUI();

    this.lights = {
      ambient: new CustomizableLight('AmbientLight', {
        color: "#ff0000",
        intensity: 1
      }),
      directional: new CustomizableLight('DirectionalLight', {
        color: "#00ff00",
        intensity: 1.5
      }, {
        position: { x: 2, y: 2, z: -1 },
      }),
      spot: new CustomizableLight('SpotLight', {
        color: "#0000ff",
        intensity: 3.6,
        distance: 10,
        angle: Math.PI * 0.3
      }, {
        position: { x: 0, y: 2, z: 2 },
      }),
      point: new CustomizableLight('PointLight', {
        color: "#ff0000",
        intensity: 2.7
      }, {
        position: { x: -1, y: 1, z: 0 }
      }),
    };

    this.material = new THREE.MeshStandardMaterial();

    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      this.material
    );

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      this.material
    );

  }
  
  init() {
    const lightFolder = this.gui.addFolder('Lights');
    Object.values(this.lights).forEach((light) => {
      light.addTo(this.scene);
      light.addControls(lightFolder);
    });

    
    ["directional", "spot", "point" ].forEach((lightType) => {
      this.lights[lightType].enableShadows();
    });
    
    const directionalShadowCamera = this.lights.directional.shadow.camera;
    directionalShadowCamera.top = 2;
    directionalShadowCamera.right = 2;
    directionalShadowCamera.bottom = -2;
    directionalShadowCamera.left = -2;

    this.directionalCameraHelper = new THREE.CameraHelper(directionalShadowCamera);
    this.directionalCameraHelper.visible = false;

    this.spotLightCameraHelper = new THREE.CameraHelper(this.lights.spot.shadow.camera);
    this.spotLightCameraHelper.visible = false;

    this.pointLightCameraHelper = new THREE.CameraHelper(this.lights.point.shadow.camera);
    this.pointLightCameraHelper.visible = false;
  
    this.material.roughness = 0.476;
    this.material.metalness = 0.7;
    this.addMaterialControls();

    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.5;

    this.sphere.castShadow = true;
    this.plane.receiveShadow = true;

    this.scene.add(
      this.directionalCameraHelper,
      this.spotLightCameraHelper,
      this.pointLightCameraHelper,
      this.sphere, 
      this.plane
    );

    this.view.setCamera({
      position: { x: 1, y: 1, z: 2 },
      lookAt: { x: 0, y: 0, z: 0 }
    });

    this.view.enableShadows()
      
    this.view.show(this.scene);
    this.view.setTick(() => this.animation());
  }

  animation() {
    Object.values(this.lights).forEach((light) => {
      light.update();
    });
  }

  dispose() {
    this.gui.destroy();
    Object.values(this.lights).forEach((light) => {
      light.dispose(this.scene);
    });

    [this.sphere, this.plane].forEach((object) => {
      this.scene.remove(object);
      object.geometry.dispose();
    });
    this.material.dispose();
    
    this.directionalCameraHelper.dispose();
    this.spotLightCameraHelper.dispose();
  }

  addMaterialControls() {
    const materialFolder = this.gui.addFolder('Objects Material');
    ['metalness', 'roughness'].forEach((property) => {
      materialFolder.add(this.material, property)
        .min(0)
        .max(1)
        .step(0.001);
    });
  }
}