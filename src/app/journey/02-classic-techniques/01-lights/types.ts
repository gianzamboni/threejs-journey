import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

export type Lights = {
  ambient: THREE.AmbientLight,
  directional: THREE.DirectionalLight,
  hemisphere: THREE.HemisphereLight,
  point: THREE.PointLight,
  rectArea: THREE.RectAreaLight,
  spot: THREE.SpotLight
}

export type Helpers = {
  directional: THREE.DirectionalLightHelper,
  point: THREE.PointLightHelper,
  rectArea: RectAreaLightHelper,
  spot: THREE.SpotLightHelper
}

export type HelperStatusDict = Record<keyof Helpers, boolean>;
