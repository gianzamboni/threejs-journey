import { BoxGeometry, MeshBasicMaterial, Mesh, BufferGeometry, Material } from 'three';
import { expect, describe, it, vi } from 'vitest';

import { createRedCube, disposeMesh, disposeObjects } from '../three-utils';

// Mock Three.js classes
vi.mock('three', () => {
  return {
    BoxGeometry: vi.fn().mockImplementation(() => ({
      dispose: vi.fn()
    })),
    MeshBasicMaterial: vi.fn().mockImplementation(() => ({
      dispose: vi.fn()
    })),
    Mesh: vi.fn().mockImplementation((geometry, material) => ({
      geometry,
      material
    }))
  };
});

describe('createRedCube', () => {
  it('should create a red cube with correct parameters', () => {
    const cube = createRedCube();
    
    expect(BoxGeometry).toHaveBeenCalledWith(1, 1, 1, 1, 1, 1);
    expect(MeshBasicMaterial).toHaveBeenCalledWith({ color: 0xff0000 });
    expect(Mesh).toHaveBeenCalled();
    // Check that cube has the expected properties
    expect(cube).toHaveProperty('geometry');
    expect(cube).toHaveProperty('material');
  });
});

describe('disposeMesh', () => {
  it('should dispose geometry and single material', () => {
    const geometry = { dispose: vi.fn() } as unknown as BufferGeometry;
    const material = { dispose: vi.fn() } as unknown as Material;
    
    disposeMesh({ geometry, material });
    
    expect(geometry.dispose).toHaveBeenCalled();
    expect(material.dispose).toHaveBeenCalled();
  });

  it('should dispose geometry and multiple materials', () => {
    const geometry = { dispose: vi.fn() } as unknown as BufferGeometry;
    const materials = [
      { dispose: vi.fn() },
      { dispose: vi.fn() }
    ] as unknown as Material[];
    
    disposeMesh({ geometry, material: materials });
    
    expect(geometry.dispose).toHaveBeenCalled();
    materials.forEach(material => {
      expect(material.dispose).toHaveBeenCalled();
    });
  });

  it('should handle multiple meshes', () => {
    const mesh1 = {
      geometry: { dispose: vi.fn() } as unknown as BufferGeometry,
      material: { dispose: vi.fn() } as unknown as Material
    };
    const mesh2 = {
      geometry: { dispose: vi.fn() } as unknown as BufferGeometry,
      material: { dispose: vi.fn() } as unknown as Material
    };
    
    disposeMesh(mesh1, mesh2);
    
    expect(mesh1.geometry.dispose).toHaveBeenCalled();
    expect(mesh1.material.dispose).toHaveBeenCalled();
    expect(mesh2.geometry.dispose).toHaveBeenCalled();
    expect(mesh2.material.dispose).toHaveBeenCalled();
  });
});

describe('disposeObjects', () => {
  it('should dispose single object', () => {
    const object = { dispose: vi.fn() };
    
    disposeObjects(object);
    
    expect(object.dispose).toHaveBeenCalled();
  });

  it('should dispose multiple objects', () => {
    const objects = [
      { dispose: vi.fn() },
      { dispose: vi.fn() },
      { dispose: vi.fn() }
    ];
    
    disposeObjects(...objects);
    
    objects.forEach(obj => {
      expect(obj.dispose).toHaveBeenCalled();
    });
  });
}); 