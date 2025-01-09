import * as THREE from 'three';

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading started: ${url}, ${itemsLoaded}/${itemsTotal}`);
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading progress: ${url}, ${itemsLoaded}/${itemsTotal}`);
};
loadingManager.onLoad = () => {
  console.log(`Loading finished`);
};
loadingManager.onError = (url) => {
  console.error(`Error loading: ${url}`);
};

export const TEXTURE_LOADER = new THREE.TextureLoader(loadingManager);

