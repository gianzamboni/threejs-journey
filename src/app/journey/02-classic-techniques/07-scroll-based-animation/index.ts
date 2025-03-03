

import gsap from 'gsap';
import * as THREE from 'three';

import { Timer } from 'three/addons/misc/Timer.js';

import { Exercise } from '#/app/decorators/exercise';
import RenderView from '#/app/layout/render-view';
import { AssetLoader } from '#/app/utils/assets-loader';
import { Interactions } from './interactions';
import { ScrollBasedAnimationLayout } from './layout';

import AnimatedExercise from '../../exercises/animated-exercise';


/**
 * Scroll-based animation exercise
 */

type MeshObjects = {
  texture: THREE.Texture;
  material: THREE.MeshToonMaterial;
  meshes: THREE.Mesh[];
}

type Particles = {
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  mesh: THREE.Points;
}

@Exercise('scroll-based-animation')
export class ScrollBasedAnimation extends AnimatedExercise {

  private layout: ScrollBasedAnimationLayout;
  
  private static materialColor: string = "#ffeded";
  private static objectDistance: number = 4;

  private meshObjects: MeshObjects;
  private particles: Particles;

  private light: THREE.DirectionalLight;

  private cameraGroup: THREE.Group; 
  
  private interactions: Interactions;
  
  private view: RenderView;

  constructor(view: RenderView) {
    super();
    this.view = view;
    this.layout = new ScrollBasedAnimationLayout();

    this.interactions = new Interactions(this.layout.element);
    this.interactions.addEventListener('sectionChange', this.sectionChangeHandler.bind(this) as EventListenerOrEventListenerObject);
    
    this.meshObjects = this.createMeshObjects();
    this.particles = this.createParticles();

    this.light = new THREE.DirectionalLight(0xffffff, 3);
    this.light.position.set(1, 0, 0);

    this.camera.position.set(0,0,7);
    this.camera.fov = 35;
    this.camera.updateProjectionMatrix();

    this.cameraGroup = new THREE.Group();
    this.cameraGroup.add(this.camera);

    this.scene.add(...this.meshObjects.meshes, this.light, this.particles.mesh, this.cameraGroup);
  }

  // Empty implementation of setupSceneCamera() to prevent BaseExercise from adding the camera to the scene
  // this is already done in the constructor of this class using the cameraGroup instead of the camera directly
  protected setupSceneCamera() {} 

  private loadGradientTexture() {
    const assetLoader = AssetLoader.getInstance();
    const gradientTexture = assetLoader.loadTexture('textures/gradients/3.jpg');
    gradientTexture.colorSpace = THREE.SRGBColorSpace;
    gradientTexture.magFilter = THREE.NearestFilter;
    return gradientTexture;
  }

  private createMeshObjects(): MeshObjects {
    const texture = this.loadGradientTexture();
    const material = new THREE.MeshToonMaterial({
      color: ScrollBasedAnimation.materialColor,
      gradientMap: texture,
    });

    const geometries = [
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      new THREE.ConeGeometry(1, 2, 32),
      new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    ];

    const meshes = geometries.map((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -ScrollBasedAnimation.objectDistance * index;
      return mesh;
    });
    
    return {
      texture,
      material,
      meshes,
    };
  }

  private createParticles(): Particles {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
   
    for(let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5)* 10;
      positions[i * 3 + 1] = ScrollBasedAnimation.objectDistance - Math.random() * ScrollBasedAnimation.objectDistance * this.layout.length;
      positions[i * 3 + 2] = (Math.random() - 0.5)* 10;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: ScrollBasedAnimation.materialColor,
      sizeAttenuation: true,
      size: 0.03
    });

    const particles = new THREE.Points(geometry, material);

    return {
      geometry,
      material,
      mesh: particles,
    }
  }

  frame(timer: Timer): void {
    const deltaTime = timer.getDelta();

    for(const mesh of this.meshObjects.meshes) {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    }

    this.camera.position.y = -this.interactions.yScroll / this.view.height * ScrollBasedAnimation.objectDistance;

    const parallax = {
      x: this.interactions.cursor.x * 0.5,
      y: -this.interactions.cursor.y * 0.5,
    }

    this.cameraGroup.position.x += (parallax.x - this.cameraGroup.position.x)*deltaTime*5;
    this.cameraGroup.position.y += (parallax.y - this.cameraGroup.position.y)*deltaTime*5;

  }

  private sectionChangeHandler(evt: CustomEvent<{ section: number }>) {
    const section = evt.detail.section;

    gsap.to(this.meshObjects.meshes[section].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: "+=6",
      y: "+=3",
      z: "+=1.5"
    })
  }

  async dispose() {
    super.dispose();
    for(const mesh of this.meshObjects.meshes) {
      mesh.geometry.dispose();
    }
    this.meshObjects.material.dispose();
    this.meshObjects.texture.dispose();
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    this.interactions.dispose();
    this.layout.remove();
    }
} 