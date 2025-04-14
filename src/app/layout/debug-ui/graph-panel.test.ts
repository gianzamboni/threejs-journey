import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { GraphPanel } from './graph-panel';

describe('GraphPanel', () => {
  const parentElement = document.body;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: Partial<CanvasRenderingContext2D>;
  
  beforeEach(() => {
    parentElement.innerHTML = '';
    mockCanvas = document.createElement('canvas');
    mockContext = {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn()
    };
    
    // Mock createElement to return our canvas
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }
      return document.createElement(tagName);
    });
    
    // Mock getContext with proper type handling
    vi.spyOn(mockCanvas, 'getContext').mockImplementation((() => {
      return function(this: HTMLCanvasElement, contextId: string) {
        if (contextId === '2d') {
          return mockContext as unknown as CanvasRenderingContext2D;
        }
        return null;
      };
    })() as typeof mockCanvas.getContext);
    
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a GraphPanel instance and appends to parent', () => {
    const graphPanel = new GraphPanel('FPS', parentElement);
    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(parentElement.contains(mockCanvas)).toBe(true);
    graphPanel.dispose();
  });
  
  it('updates the graph with values', () => {
    const graphPanel = new GraphPanel('FPS', parentElement);
    
    // Test with a single update
    graphPanel.update(60);
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.fillText).toHaveBeenCalled();
    
    // Reset mocks to test again
    vi.clearAllMocks();
    
    // Multiple updates to test min/max tracking
    graphPanel.update(30);
    graphPanel.update(90);
    graphPanel.update(45);
    
    // Should have been called for each update
    expect(mockContext.clearRect).toHaveBeenCalledTimes(3);
    expect(mockContext.fillText).toHaveBeenCalledTimes(3);
    
    graphPanel.dispose();
  });
  
  it('disposes and removes the canvas element', () => {
    const graphPanel = new GraphPanel('FPS', parentElement);
    vi.spyOn(mockCanvas, 'remove');
    
    graphPanel.dispose();
    expect(mockCanvas.remove).toHaveBeenCalled();
  });
  
  it('throws an error if canvas context is null', () => {
    // Mock getContext to return null
    vi.spyOn(mockCanvas, 'getContext').mockReturnValueOnce(null);
    
    expect(() => new GraphPanel('FPS', parentElement)).toThrow('Unable to get canvas context');
  });
});
