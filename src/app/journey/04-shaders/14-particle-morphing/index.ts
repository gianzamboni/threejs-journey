import { 
  AdditiveBlending, 
  BufferAttribute, 
  Float32BufferAttribute, 
  InterleavedBufferAttribute, 
  Mesh, 
  Points, 
  ShaderMaterial, 
  Uniform 
} from "three";
import { BufferGeometry } from "three";

import { Customizable } from "#/app/decorators/customizable";
import { Exercise } from "#/app/decorators/exercise";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import particlesFragmentShader from "./shaders/particles.frag";
import particlesVertexShader from "./shaders/particles.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const BACKGROUND_COLOR = "#160920";

@Exercise('particle-morphing')
export class ParticleMorphing extends OrbitControlledExercise {

  @Customizable([{
    propertyPath: "clearColor",
    initialValue: BACKGROUND_COLOR,
    type: "color",
    settings: {
      name: "Background Color",
      onChange: "updateBackgroundColor",
    }
  }])
  private _view: RenderView;

  private material: ShaderMaterial;
  private geometry: BufferGeometry;

  private points: Points | undefined;

  constructor(view: RenderView) {
    super(view);
    this._view = view;
  
    this.material = this.createMaterial();
    this.geometry = new BufferGeometry();

    this.loadModels();
    this.setupScene();
  }

  updateMaterial(event: CustomEvent) {
    const { size, pixelRatio } = event.detail;
    this.material.uniforms.uResolution.value.set(size.width * pixelRatio, size.height * pixelRatio);
  }

  updateBackgroundColor(color: string) {
    this._view.setRender({
      clearColor: color,
    })
  }

  private loadModels() {
    AssetLoader.getInstance()
    .loadModel("models/models.glb", (group) => {
      const positionBuffers = group.children.map((child) => {
        return (child as Mesh).geometry.attributes.position;
      });

      const normalizedPositions = this.normalizePositions(positionBuffers);
      
      this.geometry.setAttribute('position', normalizedPositions[1]);
      this.geometry.setAttribute('aPositionTarget', normalizedPositions[3]);

      this.points = new Points(this.geometry, this.material);
      this.scene.add(this.points);
  }, { useDraco: true })

  }

  private normalizePositions(buffers: (BufferAttribute | InterleavedBufferAttribute)[]) {
    const maxLength = buffers.reduce((max, buffer) => {
      return Math.max(max, buffer.count);
    }, 0);

    const normalizedBuffers = buffers.map((buffer) => {
      return this.cloneAndNormalizeBuffer(buffer, maxLength);
    });

    return normalizedBuffers;
  }

  private cloneAndNormalizeBuffer(buffer: BufferAttribute | InterleavedBufferAttribute, newLength: number) {
    const originalBuffer = buffer.array;
    const newArray = new Float32Array(newLength * 3);
    
    for (let i = 0; i < newLength; i++) {
      const i3 = i * 3;
      const sourceIndex = i3 < originalBuffer.length 
        ? i3 
        : Math.floor(Math.random() * (originalBuffer.length / 3)) * 3;
        
      newArray.set(
        [originalBuffer[sourceIndex], 
        originalBuffer[sourceIndex + 1], 
        originalBuffer[sourceIndex + 2]], 
        i3
      );
    }

    return new Float32BufferAttribute(newArray, 3);
  }

  private setupScene() {
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1;
    this.camera.fov = 35;
    this.camera.position.set(-4, 0, 18);
    this.camera.lookAt(0 ,0, 0);
    this.camera.updateProjectionMatrix();
    this._view.addEventListener('resize', this.updateMaterial.bind(this) as EventListener);

    this._view.setRender({
      clearColor: BACKGROUND_COLOR,
    })
  }
  async dispose() {
    super.dispose();
    this.geometry?.dispose();
    this.material.dispose();
    this._view.removeEventListener('resize', this.updateMaterial.bind(this) as EventListener);
  }

  private createMaterial() {
    return new ShaderMaterial({
      blending: AdditiveBlending,
      depthWrite: false,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uSize: new Uniform(0.15),
        uResolution: new Uniform(this.view.resolution),
      }
    });
  }
}