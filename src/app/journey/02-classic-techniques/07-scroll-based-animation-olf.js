

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