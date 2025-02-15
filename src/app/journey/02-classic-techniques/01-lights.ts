import * as THREE from 'three';
import RenderView from '@/app/layout/render-view';
import OrbitControlledExercise from '../exercises/orbit-controlled-exercise';
import { CustomizableEntries, Debuggable } from '../decorators/debug';

@Debuggable
export class LightsExercise extends OrbitControlledExercise {

  public static id = 'lights';

  private material: THREE.MeshStandardMaterial;
  private animatedObjects: THREE.Mesh[];
  private plane: THREE.Mesh;

  @CustomizableEntries({
    default: [{
      propertyPath: "onOff",
      initialValue: true,
      configuration: {
        name: "On/Off",
        onChange: "toggleLight"
      },
    }]
  })
  private ligths: Record<string, THREE.Light>;

  constructor(view: RenderView) {
    super(view);
    this.camera.position.set(2, 1, 3);
    this.material = new THREE.MeshStandardMaterial();
    this.material.roughness = 0.4;

    this.animatedObjects = [
      new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), this.material),
      new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), this.material),
      new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), this.material),
    ];

    this.animatedObjects[0].position.x = -1.5;
    this.animatedObjects[2].position.x = 1.5;

    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), this.material);
    this.plane.rotation.x = -Math.PI * 0.5;
    this.plane.position.y = -0.65;

    this.ligths = {
      ambient: new THREE.AmbientLight(0xffffff, 0.2),
      directional: new THREE.DirectionalLight(0x00fffc, 0.9),
      hemisphere: new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9),
      point: new THREE.PointLight(0xff9000, 1.5, 0, 2),
      rectArea: new THREE.RectAreaLight(0x4e00ff, 6, 1, 1),
      spot: new THREE.SpotLight(0x78ff00, 4.5, 0, Math.PI * 0.1, 0.25, 1)
    };

    this.ligths.directional.position.set(1, 0, 0);
    this.ligths.point.position.set(1, -0.5, 1);
    this.ligths.rectArea.position.set(-1.5, 0, 1.5);
    this.ligths.spot.position.set(0, 2, 3);

    this.ligths.rectArea.lookAt(0, 0, 0);
    (this.ligths.spot as THREE.SpotLight).target.position.set(-0.75, 0, 0);

       //     this.lights = [
//       new CustomizableLight("AmbientLight", {}),
//       new CustomizableLight("DirectionalLight",{ showHelper: true }),
//       new CustomizableLight("HemisphereLight", { showHelper: true }),
//       new CustomizableLight("PointLight", { showHelper: true }),
//       new CustomizableLight("RectAreaLight", { showHelper: true }),
//       new CustomizableLight("SpotLight",{ showHelper: true })
//     ];
    this.scene.add(
      ...this.animatedObjects, 
      this.plane,
      ...Object.values(this.ligths)
    );
  }

//   init() {
//     this.lights.forEach(light => {
//       light.addControls(this.gui);
//       light.addTo(this.scene)
//       if(light.type === "SpotLight") {
//         this.scene.add(light.light.target);
//       }
//     });
//     this.view.show(this.scene);
//   }

//   animation() {
//     const elapsedTime = this.clock.getElapsedTime();
//     this.lights.forEach(light => light.update());
//     this.objects.forEach(object => {
//       object.rotation.y = 0.1 * elapsedTime;
//       object.rotation.x = 0.15 * elapsedTime;
//     });    
//   };

  async dispose() {
    await super.dispose();
    Object.values(this.ligths).forEach(light => {
      light.dispose();
    });
    this.plane.geometry.dispose();
    this.animatedObjects.forEach(object => {
      object.geometry.dispose();
    });
    this.material.dispose();
  }

  toggleLight(lightName: keyof typeof LightsExercise.prototype.ligths) {
    const light = this.ligths[lightName];
    light.visible = !light.visible;
  }
}
