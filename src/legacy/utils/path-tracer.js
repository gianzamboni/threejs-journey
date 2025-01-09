import * as THREE from 'three';

export class PathTracer {
  constructor(obj, color) {
    this.obj = obj;
    this.material = new THREE.LineBasicMaterial({ color: color });
    this.path = [obj.position.clone()];
    this.mesh = new THREE.Group();
  }

  addTo(scene) {
    scene.add(this.mesh);
  }

  update() {
    const lastPositionIndex = this.path.length - 1;
    this.path.push(this.obj.position.clone());
    const geometry = new THREE.BufferGeometry().setFromPoints([this.path[lastPositionIndex], this.path[lastPositionIndex + 1]]);
    const line = new THREE.Line(geometry, this.material);
    this.mesh.add(line);
    if (this.mesh.children.length > 5000) {
      this.mesh.remove(this.mesh.children[0]);
    }
  }

  dispose() {
    this.mesh.children.forEach((line) => {
      line.geometry.dispose();
      line.material.dispose();
    });
  };
}