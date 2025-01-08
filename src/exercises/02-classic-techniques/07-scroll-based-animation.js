import * as THREE from 'three'
import GUI from 'lil-gui';

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
      material: {
        color: "#ffeded",
      }
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

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
  }

  async init() {
    await this.view.changeRenderer({
      alpha: true
    });
    this.gui.add(this.settings.material, 'color').name('Material Color');
    this.scene.add(this.cube);
    this.view.show(this.scene);
  }

  dispose() {
    this.gui.destroy();
    this.htmlSections.forEach((section) => {
      section.remove();
    });
    this.scene.remove(this.cube);
    this.cube.geometry.dispose();
    this.cube.material.dispose();
    document.body.style.overflow = 'auto';
  }
}