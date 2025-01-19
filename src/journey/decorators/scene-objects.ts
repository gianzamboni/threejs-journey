import * as THREE from 'three';

import { getDecoratorSettings } from "./decorator-settings";

export function SceneObject(targetClass: any, propertyKey: string) {
  let settings = getDecoratorSettings(targetClass.constructor);
  if(!settings.sceneMeshes) {
    settings.sceneMeshes = []
  }
  settings.sceneMeshes.push(propertyKey);
}

export function addSceneObjectsToScene(
  exerciseIntance: any, 
  objectNames: string[] | undefined) {

  if(objectNames === undefined) return;
  
  const meshes = objectNames.map(name => exerciseIntance[name]) as THREE.Mesh[];
  
  (exerciseIntance.scene as THREE.Scene).add(...meshes);
}