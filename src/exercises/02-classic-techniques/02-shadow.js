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
    };

    this.spotLight = new THREE.SpotLight(0x0000ff, 3.6, 10, Math.PI * 0.3);
    this.pointLight = new THREE.PointLight(0x0ff000, 2.7);
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
    Object.values(this.lights).forEach((light) => {
      light.addTo(this.scene);
      light.addControls(this.gui);
    });

    this.spotLight.position.set(0, 2, 2);
    this.pointLight.position.set(-1, 1, 0);
    
    ["directional", ].forEach((lightType) => {
      this.lights[lightType].enableShadows();
    });
    
    [this.spotLight].forEach((light) => {
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 6;
      //this.directionalLight.shadow.radius = 10;
    });
    
    this.lights.directional.shadow.camera.top = 2;
    this.lights.directional.shadow.camera.right = 2;
    this.lights.directional.shadow.camera.bottom = -2;
    this.lights.directional.shadow.camera.left = -2;

    this.directionalCameraHelper = new THREE.CameraHelper(this.lights.directional.shadow.camera);
    this.directionalCameraHelper.visible = false;

    this.spotLightCameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
    this.spotLightCameraHelper.visible = false;

    this.addLightControls();

    this.material.roughness = 0.7;
    this.addMaterialControls();

    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.5;

    this.sphere.castShadow = true;
    this.plane.receiveShadow = true;

    this.scene.add(
      this.spotLight,
      this.spotLight.target,
      this.directionalCameraHelper,
      this.spotLightCameraHelper,
      this.pointLight,
      this.sphere, 
      this.plane
    );

    this.view.setCamera({
      position: { x: 1, y: 1, z: 2 },
      lookAt: { x: 0, y: 0, z: 0 }
    });

    this.view.enableShadows()
    this.view.toggleOrbitControls(true);
    this.view.show(this.scene);
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
    this.pointLight.dispose();
    [this.spotLight].forEach((light) => { 
      this.scene.remove(light);
      light.dispose();
    });
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

  addLightControls() {
    [this.spotLight, this.pointLight].forEach((light) => {
      const folder = this.gui.addFolder(light.type);
      folder.add(light, 'intensity')
        .min(0)
        .max(3)
        .step(0.001);

      if (light.type === 'SpotLight' || light.type === 'PointLight') {
        const positionFolder = folder.addFolder('Position');
        
        ['x', 'y', 'z'].forEach((axis) => {
          positionFolder.add(light.position, axis)
            .min(-5)
            .max(5)
            .step(0.001);
        });
      }
    });
  }
}