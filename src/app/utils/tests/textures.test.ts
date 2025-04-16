import { SRGBColorSpace } from 'three';
import { expect, describe, it, vi, beforeEach } from 'vitest';

import { AssetLoader } from '../assets-loader';
import { TextureMaps, loadTextureMaps, TextureQuality } from '../textures';

// Mock AssetLoader
vi.mock('../assets-loader', () => {
  const mockLoadTexture = vi.fn().mockImplementation(() => ({
    colorSpace: null
  }));

  return {
    AssetLoader: {
      getInstance: vi.fn().mockReturnValue({
        loadTexture: mockLoadTexture
      })
    }
  };
});

describe('loadTextureMaps', () => {
  let mockAssetLoader: { loadTexture: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockAssetLoader = AssetLoader.getInstance() as unknown as { loadTexture: ReturnType<typeof vi.fn> };
    vi.clearAllMocks();
  });

  it('should load basic texture maps with default format', () => {
    const textureFolder = 'wood';
    const resolution: TextureQuality = '2k';
    const mapTypes = [TextureMaps.Color, TextureMaps.Normal];

    const textures = loadTextureMaps(textureFolder, resolution, mapTypes);

    expect(mockAssetLoader.loadTexture).toHaveBeenCalledTimes(2);
    expect(mockAssetLoader.loadTexture).toHaveBeenCalledWith('/textures/wood/2k/diff.jpg');
    expect(mockAssetLoader.loadTexture).toHaveBeenCalledWith('/textures/wood/2k/nor_gl.jpg');
    expect(textures[TextureMaps.Color]).toBeDefined();
    expect(textures[TextureMaps.Normal]).toBeDefined();
  });

  it('should load texture maps with custom format', () => {
    const textureFolder = 'metal';
    const resolution: TextureQuality = '4k';
    const mapTypes = [
      { type: TextureMaps.Color, format: 'png' },
      { type: TextureMaps.Roughness }
    ];

    const textures = loadTextureMaps(textureFolder, resolution, mapTypes);

    expect(mockAssetLoader.loadTexture).toHaveBeenCalledTimes(2);
    expect(mockAssetLoader.loadTexture).toHaveBeenCalledWith('/textures/metal/4k/diff.png');
    expect(mockAssetLoader.loadTexture).toHaveBeenCalledWith('/textures/metal/4k/roughness.jpg');
    expect(textures[TextureMaps.Color]).toBeDefined();
    expect(textures[TextureMaps.Roughness]).toBeDefined();
  });

  it('should set color texture to SRGB color space', () => {
    const textureFolder = 'wood';
    const resolution: TextureQuality = '1k';
    const mapTypes = [TextureMaps.Color];

    const textures = loadTextureMaps(textureFolder, resolution, mapTypes);

    expect(textures[TextureMaps.Color]?.colorSpace).toBe(SRGBColorSpace);
  });

  it('should not set color space for non-color textures', () => {
    const textureFolder = 'wood';
    const resolution: TextureQuality = '1k';
    const mapTypes = [TextureMaps.Normal];

    const textures = loadTextureMaps(textureFolder, resolution, mapTypes);

    expect(textures[TextureMaps.Normal]?.colorSpace).toBeNull();
  });
}); 