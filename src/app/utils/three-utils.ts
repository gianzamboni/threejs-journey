import { 
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferGeometry,
  Material
} from 'three';

export function createRedCube() {
  const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const cube = new Mesh(geometry, material);
  return cube;
}

export function disposeMesh(...args: { geometry: BufferGeometry, material: Material | Material[] }[]) {
  for(const mesh of args) {
    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) {
      for(const material of mesh.material) {
        material.dispose();
      }
    } else {
      mesh.material.dispose();
    }
  }
}

export function disposeObjects(...args: { dispose: () => void }[] ) {
  for(const object of args) {
    object.dispose();
  }
}