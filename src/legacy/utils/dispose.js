export function dispose(mesh) {
  mesh.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }
    if (child.material) {
      child.material.dispose();
    }
  });
  mesh.geometry.dispose();
  mesh.material.dispose();
}