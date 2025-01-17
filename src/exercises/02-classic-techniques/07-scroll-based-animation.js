import * as THREE from 'three'
import GUI from 'lil-gui';
import { TEXTURE_LOADER } from '../../utils/loading-manager';
import gsap from 'gsap';

export class ScrollBasedAnimation {
  constructor(view, debugUI) {
    this.view = view;
    this.scene = new THREE.Scene();
    this.gui = new GUI({
      name: "Settings",
      closed: false,
      container: debugUI.lilGuiContainer
    });

    this.settings = {
      materialColor: "#ffeded",
      objectDistance: 4,
    }

    this.htmlSections = ['My Portfolio', "My projects", "Contact me"].map((text, index) => {
      const section = document.createElement('section');
      section.classList.add('scroll-based-animation--section');

      const h2 = document.createElement('h2');
      h2.textContent = text;

      section.appendChild(h2);
      document.body.appendChild(section);
      return section;
    });

    document.body.style.overflow = 'auto';
    document.body.style.background = '#1e1a20';

    this.gradientTexture = TEXTURE_LOADER.load('textures/gradients/3.jpg');
    this.gradientTexture.colorSpace = THREE.SRGBColorSpace;
    this.gradientTexture.magFilter = THREE.NearestFilter;

    this.material = new THREE.MeshToonMaterial({
      color: this.settings.materialColor,
      gradientMap: this.gradientTexture,
    });

    this.meshes = [
      new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        this.material
      ),
      new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        this.material
      ),
      new THREE.Mesh(
        new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
        this.material
      ),
    ];

    this.scrollPostion = window.scrollY;
    this.cursorPosition = { x: 0, y: 0 };
    this.currentSection = 0;
    this.directionaLight = new THREE.DirectionalLight(0xffffff, 3);
    this.cameraGroup = new THREE.Group();

    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5)* 10;
      positions[i * 3 + 1] = this.settings.objectDistance - Math.random() * this.settings.objectDistance * this.htmlSections.length;
      positions[i * 3 + 2] = (Math.random() - 0.5)* 10;
    }

    this.particlesGeometry = new THREE.BufferGeometry();
    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particlesMaterial = new THREE.PointsMaterial({
      color: this.settings.materialColor,
      sizeAttenuation: true,
      size: 0.03
    });

    this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);
  }

  async init() {
    this.view.setClearAlpha(0);

    this.view.setCamera({
      position: { x: 0, y: 0, z: 6 },
      lookAt: { x: 0, y: 0, z: 0 },
      fov: 35,
    })
    
    this.meshes.forEach((mesh, index) => {
      mesh.position.y = - this.settings.objectDistance * index;
    })
    this.scene.add(this.particles);

    this.directionaLight.position.set(1, 0, 0);
    this.gui.addColor(this.settings, 'materialColor').name('Material Color').onChange((event) => {
      this.material.color.set(new THREE.Color(this.settings.materialColor));
      this.particlesMaterial.color.set(new THREE.Color(this.settings.materialColor));
    });

    this.scene.add(...this.meshes, this.directionaLight, this.cameraGroup);
    this.view.show(this.scene, this.cameraGroup);
  }

  animation(timer) {
    const deltaTime = timer.getDelta();

    this.meshes.forEach(mesh => {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    })

    this.view.camera.position.y = -this.scrollPostion / this.view.size.height * this.settings.objectDistance;

    const parallax = {
      x: this.cursorPosition.x * 0.5,
      y: -this.cursorPosition.y * 0.5,
    }

    this.cameraGroup.position.x += (parallax.x - this.cameraGroup.position.x)*deltaTime*5;
    this.cameraGroup.position.y += (parallax.y - this.cameraGroup.position.y)*deltaTime*5;
  }

  scroll(value) {
    this.scrollPostion = value;

    const newSection = Math.round(value / this.view.size.height);
    if(newSection !== this.currentSection) {
      this.currentSection = newSection;
      gsap.to(this.meshes[this.currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: "+=6",
        y: "+=3",
        z: "+=1.5"
      })
    };
  }

  mouseMove(x, y) {
    this.cursorPosition = {
      x: x / this.view.size.width - 0.5,
      y: y / this.view.size.height - 0.5
    }
  }

  dispose() {
    this.gui.destroy();
    this.htmlSections.forEach((section) => {
      section.remove();
    });

    this.scene.remove(this.particles);
    this.meshes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
    });

    this.bufferGeometry.dispose();
    this.particlesMaterial.dispose();
    this.material.dispose();
    this.gradientTexture.dispose();
    document.body.style.overflow = 'auto';
  }
}