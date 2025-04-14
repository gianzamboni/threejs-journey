import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

import RenderView from '#/app/layout/render-view';

import { AnimationLoop } from '../animation-loop';

// Mock RenderView
vi.mock('#/app/layout/render-view');

describe('AnimationLoop', () => {
  let animationLoop: AnimationLoop;
  let mockTick: ReturnType<typeof vi.fn>;
  let mockView: RenderView;

  beforeEach(() => {
    // Setup mocks
    mockTick = vi.fn();
    mockView = {
      update: vi.fn()
    } as unknown as RenderView;

    // Create instance
    animationLoop = new AnimationLoop(mockTick);

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(cb, 0);
      return 0;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should initialize and start animation', () => {
    animationLoop.init(mockView);
    expect(mockTick).toHaveBeenCalled();
    expect(mockView.update).toHaveBeenCalled();
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should continue animation loop while running', async () => {
    animationLoop.init(mockView);
    
    // Wait for a few animation frames
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockTick).toHaveBeenCalled();
    expect(mockView.update).toHaveBeenCalled();
  });

  it('should stop animation when requested', async () => {
    animationLoop.init(mockView);
    
    // Let it run for a bit
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Stop animation
    await animationLoop.stop();
    
    const tickCallsBefore = mockTick.mock.calls.length;
    const updateCallsBefore = (mockView.update as ReturnType<typeof vi.fn>).mock.calls.length;
    
    // Wait to ensure no more calls are made
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(mockTick.mock.calls.length).toBe(tickCallsBefore);
    expect((mockView.update as ReturnType<typeof vi.fn>).mock.calls.length).toBe(updateCallsBefore);
  });
}); 