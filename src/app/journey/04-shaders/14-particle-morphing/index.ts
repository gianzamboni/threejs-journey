import gsap from "gsap";
import { 
  AdditiveBlending, 
  BufferAttribute, 
  Color, 
  Float32BufferAttribute, 
  InterleavedBufferAttribute, 
  Mesh, 
  Points, 
  ShaderMaterial, 
  Uniform 
} from "three";
import { BufferGeometry } from "three";

import { Timer } from 'three/addons/misc/Timer.js';

import { Callable, Customizable } from "#/app/decorators/customizable";
import { ActionButton, Description, Exercise, Starred } from "#/app/decorators/exercise";
import { ActionBar } from "#/app/layout/action-bar";
import RenderView from "#/app/layout/render-view";
import { AssetLoader } from "#/app/services/assets-loader";
import { ExtraConfig } from "#/app/types/exercise";
import DONUT_ICON from "./icons/donut.svg?raw";
import DOT_ICON from "./icons/dot.svg?raw";
import SUZANNE_ICON from "./icons/monkey.svg?raw";
import SPHERE_ICON from "./icons/sphere.svg?raw";
import particlesFragmentShader from "./shaders/particles.frag";
import particlesVertexShader from "./shaders/particles.vert";

import OrbitControlledExercise from "../../exercises/orbit-controlled-exercise";

const BACKGROUND_COLOR = "#160920";

const COLOR_A = "#ff7380";
const COLOR_B = "#0091ff";

@Exercise('particle-morphing')
@Starred
@Description("<p>A particle morphing experiment. You can transform the object in the scene by clicking on the buttons above.</p>")
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

  @Customizable([{
    propertyPath: "uniforms.uProgress.value",
    settings: {
      name: "Progress",
      min: 0,
      max: 1,
      step: 0.001,
      listen: true,
    }
  }, {
    propertyPath: "colorA",
    initialValue: COLOR_A,
    type: "color",
    settings: {
      name: "Color A",
      onChange: "updateColorA", 
    }
  }, {
    propertyPath: "colorB",
    initialValue: COLOR_B,
    type: "color",
    settings: {
      name: "Color B",
      onChange: "updateColorB",
    }
  }])
  private material: ShaderMaterial;
  private geometry: BufferGeometry;
  
  private modelVertices: Float32BufferAttribute[];
  private currentModelIndex: number;

  private points: Points | undefined;


  private actionBar: ActionBar;
  private progressBar: HTMLElement | undefined;

  constructor(view: RenderView, extraConfig: ExtraConfig) {
    super(view);
    this._view = view;
  
    this.material = this.createMaterial();
    this.geometry = new BufferGeometry();

    this.modelVertices = [];
    this.currentModelIndex = 0;

    this.actionBar = extraConfig.layoutComponents.actionBar;
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

  @Callable("Morphs", "Donut", 1)
  @Callable("Morphs", "Suzanne", 2)
  @Callable("Morphs", "Sphere", 3)
  @Callable("Morphs", "Three.Js", 4)
  morph(index: number) {
    if(!this.points) return;
    this.actionBar.disable();
    this.points.geometry.attributes.position = this.modelVertices[this.currentModelIndex];
    this.points.geometry.attributes.aPositionTarget = this.modelVertices[index];

    gsap.fromTo(
      this.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: 5, ease: "linear", onComplete: () => {
        this.currentModelIndex = index;
        this.actionBar.enable();
      } }
    )

    if(this.progressBar) {
      this.progressBar.style.opacity = '1';
    gsap.fromTo(this.progressBar, {
      width: '0%',
    }, {
      width: '100%',
        duration: 5,
        ease: "linear",
        onComplete: () => {
          this.actionBar.enable();
        }
      })
    }
  }

  @ActionButton("Dot", DOT_ICON)
  toDot() {
    this.morph(0);
  }
  
  @ActionButton("Donut", DONUT_ICON)
  toLine() {
    this.morph(1);
  }

  @ActionButton("Suzanne", SUZANNE_ICON)
  toCircle() {
    this.morph(2);
  }

  @ActionButton("Sphere", SPHERE_ICON)
  toThreeJs() {
    this.morph(3);
  }

  @ActionButton("ThreeJs", "<span class='text-2xl'>Three.js Text</span>", "col-span-4")
  toDonut() {
    this.morph(4);
  }

  updateColorA(color: string) {
    this.material.uniforms.uColorA.value.set(new Color(color));
  }

  updateColorB(color: string) {
    this.material.uniforms.uColorB.value.set(new Color(color));
  }
  
  frame(timer: Timer) {
    super.frame(timer);
    this.material.uniforms.uTime.value = timer.getElapsed();
  }

  private loadModels() {
    AssetLoader.getInstance()
    .loadModel("models/models.glb", (group) => {
      const positionBuffers = group.children.map((child) => {
        return (child as Mesh).geometry.attributes.position;
      });

      this.modelVertices = this.normalizePositions(positionBuffers);
      
      this.geometry.setAttribute('position', this.modelVertices[this.currentModelIndex]);
      this.geometry.setAttribute('aPositionTarget', this.modelVertices[3]);

      this.generateGeometryAttribues();

      this.points = new Points(this.geometry, this.material);
      this.points.frustumCulled = false;
      
      this.scene.add(this.points);
  }, { useDraco: true })

  }

  private generateGeometryAttribues() {
    const particleCount = this.modelVertices[0].count;
    const sizesArray = new Float32Array(particleCount);

    for(let i = 0; i < particleCount; i++) {
      sizesArray[i] = Math.random();
    }

    this.geometry.setAttribute('aSize', new Float32BufferAttribute(sizesArray, 1));
  }

  private normalizePositions(buffers: (BufferAttribute | InterleavedBufferAttribute)[]) {
    const maxLength = buffers.reduce((max, buffer) => {
      return Math.max(max, buffer.count);
    }, 0);

    const normalizedBuffers = buffers.map((buffer) => {
      return this.cloneAndNormalizeBuffer(buffer, maxLength);
    });

    const zeroBuffer = new Float32Array(maxLength * 3);
    normalizedBuffers.unshift(new Float32BufferAttribute(zeroBuffer, 3));
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
        uSize: new Uniform(0.4),
        uResolution: new Uniform(this.view.resolution),
        uProgress: new Uniform(0),
        uColorA: new Uniform(new Color(COLOR_A)),
        uColorB: new Uniform(new Color(COLOR_B)),
        uTime: new Uniform(0),
      }
    });
  }
}