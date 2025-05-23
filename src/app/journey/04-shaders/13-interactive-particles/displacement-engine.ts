import { BufferGeometry, Camera, CanvasTexture, Mesh, MeshBasicMaterial, Raycaster, Scene, Vector2 } from "three";

import { BufferGeometry, Camera, CanvasTexture, Mesh, MeshBasicMaterial, Raycaster, Scene, Vector2 } from "three";

import { disposeMesh } from "#/app/utils/three-utils";

export class MouseDisplacementEngine {

  private scene: Scene;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private glow: HTMLImageElement;

  private raycaster: Raycaster;
  private displacementMesh: Mesh;
  private displacementTexture: CanvasTexture;

  private mousePosition = {
    screen: new Vector2(9999, 9999),
    canvas: new Vector2(9999, 9999),
  }


  constructor(geometry: BufferGeometry, scene: Scene) {
    this.scene = scene;
    this.displacementMesh = this.createDisplacementMesh(geometry.clone());
    this.displacementMesh.visible = false;
    this.raycaster = new Raycaster();

    this.canvas = this.createCanvas();
    this.ctx = this.getContext();
    this.glow = this.createGlow();
    this.displacementTexture = new CanvasTexture(this.canvas);

    this.mousePosition.screen = new Vector2(9999, 9999);
    this.mousePosition.canvas = new Vector2(9999, 9999);

    window.addEventListener("mousemove", this.updateMousePosition.bind(this));
    document.addEventListener("touchmove", this.updateFingerPosition.bind(this), { passive: false });

    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  get texture() {
    return this.displacementTexture;
  }

  update(camera: Camera) {
    this.raycaster.setFromCamera(this.mousePosition.screen, camera);

    const previousMousePosition = this.mousePosition.canvas.clone();
    this.updateMousePositionOnCanvas();

    const distance = previousMousePosition.distanceTo(this.mousePosition.canvas);
    const alpha = Math.min(distance * 0.1, 1);

    const glowSize = this.canvas.width * 0.25;
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 0.02;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalAlpha = alpha;
    this.ctx.globalCompositeOperation = 'lighten';
    this.ctx.drawImage(this.glow, this.mousePosition.canvas.x - glowSize * 0.5, this.mousePosition.canvas.y - glowSize * 0.5, glowSize, glowSize);

    this.displacementTexture.needsUpdate = true;

    return this.displacementTexture;
  }

  dispose() {
    this.canvas.remove();
    disposeMesh(this.displacementMesh);
    this.displacementTexture.dispose();
    document.removeEventListener("mousemove", this.updateMousePosition.bind(this));
  }

  private updateMousePositionOnCanvas() {
    const intersections = this.raycaster.intersectObject(this.displacementMesh);

    if (intersections.length > 0) {
      const uv = intersections[0].uv;
      if (uv) {
        this.mousePosition.canvas.x = uv.x * this.canvas.width;
        this.mousePosition.canvas.y = (1 -uv.y) * this.canvas.height;
      }
    }
  }

  private updateFingerPosition(event: TouchEvent) {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      this.mousePosition.screen.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.screen.y = - (touch.clientY / window.innerHeight) * 2 + 1;
    }
  }

  private updateMousePosition(event: MouseEvent) {
    this.mousePosition.screen.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.screen.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  private createDisplacementMesh(geometry: BufferGeometry) {
    const interactiveMesh = new Mesh(geometry, new MeshBasicMaterial({ 
      color: 0xff0000,
    }));
    this.scene.add(interactiveMesh);
    return interactiveMesh;
  }

  private createGlow() {
    const img = new Image();
    img.src = "imgs/glow.png";
    return img;
  }

  private getContext() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }
    return ctx;
  }

  private createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    return canvas;
  }
}