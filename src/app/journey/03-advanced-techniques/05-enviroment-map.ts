import OrbitControlledExercise from "../exercises/orbit-controlled-exercise";
import RenderView from "#/app/layout/render-view";
import { Exercise } from "#/app/decorators/exercise";
import * as THREE from "three";
@Exercise("environment-map")
export class EnvironmentMap extends OrbitControlledExercise {

    private torusKnot: THREE.Mesh;

    constructor(view: RenderView) {
        super(view);

        this.torusKnot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
            new THREE.MeshBasicMaterial()
        );
        this.torusKnot.position.y = 4;
        this.scene.add(this.torusKnot);
        this.controls.target.y = 3.5;
        this.camera.position.set(4, 5, 4);
    }
    
    async dispose() {
        await super.dispose();
        this.torusKnot.geometry.dispose();
        (this.torusKnot.material as THREE.Material).dispose();
    }
}