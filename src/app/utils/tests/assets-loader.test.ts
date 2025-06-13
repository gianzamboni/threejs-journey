import { 
  TextureLoader, 
  CubeTextureLoader, 
  Scene
} from 'three';
import { expect, describe, it, vi, beforeEach, MockInstance } from 'vitest';

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import { AssetLoader } from '../../services/assets-loader';

// Mock Three.js loaders
vi.mock('three', () => {
  const mockLoadingManager = {
    onStart: null,
    onProgress: null,
    onError: null,
    onLoad: null
  };

  const mockTextureLoad = vi.fn().mockReturnValue('texture');
  const mockCubeTextureLoad = vi.fn().mockReturnValue('cubeTexture');

  return {
    LoadingManager: vi.fn().mockImplementation(() => mockLoadingManager),
    TextureLoader: vi.fn().mockImplementation(() => ({
      load: mockTextureLoad
    })),
    CubeTextureLoader: vi.fn().mockImplementation(() => ({
      load: mockCubeTextureLoad
    })),
    Scene: vi.fn(),
    Texture: vi.fn(),
    Group: vi.fn(),
    EquirectangularReflectionMapping: 'mapping'
  };
});

vi.mock('three/addons/loaders/RGBELoader.js', () => {
  const mockLoad = vi.fn().mockImplementation((_, onLoad) => {
    onLoad({ mapping: null });
    return 'rgbeLoader';
  });

  return {
    RGBELoader: vi.fn().mockImplementation(() => ({
      load: mockLoad
    }))
  };
});

vi.mock('three/addons/loaders/FontLoader.js', () => {
  const mockLoad = vi.fn().mockImplementation((_, onLoad) => {
    onLoad('font');
    return 'fontLoader';
  });

  return {
    FontLoader: vi.fn().mockImplementation(() => ({
      load: mockLoad
    })),
    Font: vi.fn()
  };
});

vi.mock('three/addons/loaders/GLTFLoader.js', () => {
  const mockLoad = vi.fn().mockImplementation((_, onLoad) => {
    onLoad({ scene: { scene: 'gltfScene' } });
  });
  const mockSetDRACOLoader = vi.fn();

  return {
    GLTFLoader: vi.fn().mockImplementation(() => ({
      load: mockLoad,
      setDRACOLoader: mockSetDRACOLoader
    })),
    GLTF: vi.fn()
  };
});

vi.mock('three/addons/loaders/DRACOLoader.js', () => {
  const mockSetDecoderPath = vi.fn();

  return {
    DRACOLoader: vi.fn().mockImplementation(() => ({
      setDecoderPath: mockSetDecoderPath,
      dispose: vi.fn()
    }))
  };
});

describe('AssetLoader', () => {
  let assetLoader: AssetLoader;
  let dispatchEventSpy: MockInstance<(event: Event) => boolean>;
  
  beforeEach(() => {
    // Reset the singleton instance for tests
    vi.spyOn(AssetLoader, 'getInstance').mockRestore();
    // @ts-expect-error - accessing private property for testing
    AssetLoader.instance = undefined;
    
    assetLoader = AssetLoader.getInstance();
    dispatchEventSpy = vi.spyOn(assetLoader, 'dispatchEvent');
    vi.clearAllMocks();
  });
  
  describe('Singleton pattern', () => {
    it('should create only one instance', () => {
      const instance1 = AssetLoader.getInstance();
      const instance2 = AssetLoader.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
  
  describe('Loading methods', () => {
    it('should load texture', () => {
      const texture = assetLoader.loadTexture('/texture.jpg');
      expect(TextureLoader).toHaveBeenCalled();
      expect(texture).toBe('texture');
    });
    
    it('should load environment map', () => {
      const scene = new Scene();
      const onLoad = vi.fn();
      
      assetLoader.loadEnvironment('/env.hdr', scene, onLoad);
      
      expect(RGBELoader).toHaveBeenCalled();
      expect(onLoad).toHaveBeenCalled();
      expect(scene.environment).toEqual({ mapping: 'mapping' });
    });
    
    it('should load cube texture', () => {
      const cubeTexture = assetLoader.loadCubeTexture('/cubemap');
      expect(CubeTextureLoader).toHaveBeenCalled();
      expect(cubeTexture).toBe('cubeTexture');
    });
    
    it('should load font', () => {
      const onLoad = vi.fn();
      assetLoader.loadFont('/font.json', onLoad);
      
      expect(FontLoader).toHaveBeenCalled();
      expect(onLoad).toHaveBeenCalledWith('font');
    });
    
    it('should load GLTF model', () => {
      const onLoad = vi.fn();
      assetLoader.loadGLTF('/model.glb', { onLoad });

      expect(GLTFLoader).toHaveBeenCalled();
      expect(onLoad).toHaveBeenCalledWith({ scene: { scene: 'gltfScene' } });
    });

    it('should load GLTF model with Draco compression', () => {
      const onLoad = vi.fn();
      assetLoader.loadGLTF('/model.glb', { onLoad, useDraco: true });
      
      expect(DRACOLoader).toHaveBeenCalled();
      expect(GLTFLoader).toHaveBeenCalled();
      // @ts-expect-error - accessing mock results
      expect(DRACOLoader.mock.results[0].value.setDecoderPath).toHaveBeenCalledWith('/draco/');
    });
    
    it('should load model and call callback with scene', () => {
      const callback = vi.fn();
      assetLoader.loadModel('/model.glb', callback);
      
      expect(GLTFLoader).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith({ scene: 'gltfScene' });
    });
  });
  
  describe('Events', () => {
    it('should dispatch loading-started event', () => {
      assetLoader.onStart('test.jpg', 0, 1);
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'loading-started',
          detail: { url: 'test.jpg', itemsLoaded: 0, itemsTotal: 1 }
        })
      );
    });
    
    it('should dispatch loading-progress event', () => {
      assetLoader.onProgress('test.jpg', 1, 2);
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'loading-progress',
          detail: { url: 'test.jpg', itemsLoaded: 1, itemsTotal: 2 }
        })
      );
    });
    
    it('should dispatch loading-error event', () => {
      assetLoader.onError('test.jpg');
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'loading-error',
          detail: expect.objectContaining({
            message: expect.any(HTMLParagraphElement),
            actionIcon: expect.anything(),
            action: expect.any(Function)
          })
        })
      );
    });
    
    it('should dispatch loading-complete event', () => {
      assetLoader.onLoad();
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'loading-complete'
        })
      );
    });
  });
  
  describe('reset', () => {
    it('should reset all loaders', () => {
      // Initialize some loaders first
      assetLoader.loadTexture('/texture.jpg');
      assetLoader.loadGLTF('/model.glb', { onLoad: () => {}, useDraco: true });
      
      // Then reset
      assetLoader.reset();
      
      // Verify new loaders are created after reset
      const textureBefore = (TextureLoader as unknown as MockInstance<() => TextureLoader>).mock.calls.length;
      assetLoader.loadTexture('/texture2.jpg');
      expect((TextureLoader as unknown as MockInstance<() => TextureLoader>).mock.calls.length).toBe(textureBefore + 1);
    });
  });
}); 