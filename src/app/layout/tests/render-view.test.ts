import { PCFShadowMap, NoToneMapping } from 'three';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import AnimatedExercise from '#/app/journey/exercises/animated-exercise';
import { Exercise } from '#/app/types/exercise';
import * as ExerciseMetadata from '#/app/utils/exercise-metadata';

import RenderView from '../render-view';

// Mock Three.js - using simple approach instead of async
vi.mock('three', () => {
  const mockRenderer = {
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    getPixelRatio: vi.fn().mockReturnValue(1),
    render: vi.fn(),
    shadowMap: {
      enabled: false,
      type: 1 // PCFShadowMap
    },
    toneMapping: 0, // NoToneMapping
    toneMappingExposure: 1,
    setClearColor: vi.fn()
  };

  return {
    WebGLRenderer: vi.fn().mockImplementation(() => mockRenderer),
    PCFShadowMap: 1,
    NoToneMapping: 0,
    Color: vi.fn().mockImplementation((_color) => ({
      color: "#000000"
    }))
  };
});

// Mock exercise metadata
vi.mock('#/app/utils/exercise-metadata', () => ({
  isAnimated: vi.fn()
}));

describe('RenderView', () => {
  let renderView: RenderView;
  let mockExercise: Exercise;
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    document.body.innerHTML = '';
    // Save original window dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
    
    // Mock exercise
    mockExercise = {
      scene: {},
      camera: {},
      updateCamera: vi.fn()
    } as unknown as Exercise;
    
    // Create instance
    renderView = new RenderView();
    renderView.addTo(document.body);

  });
  
  afterEach(() => {
    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight });
  });
  
  it('should create and initialize the renderer correctly', () => {
    const canvas = document.querySelector('#render-view-canvas');
    expect(canvas).not.toBeNull();
    expect(canvas!.className).toContain('fixed');
  });
  
  it('should run regular exercise', () => {
    // Setup isAnimated to return false
    vi.mocked(ExerciseMetadata.isAnimated).mockReturnValue(false);
    
    // Run exercise
    renderView.run(mockExercise);
    
    // Verify
    expect(ExerciseMetadata.isAnimated).toHaveBeenCalledWith(mockExercise);
  });
  
  it('should run animated exercise', () => {
    // Setup isAnimated to return true
    vi.mocked(ExerciseMetadata.isAnimated).mockReturnValue(true);
    
    // Create animated exercise mock
    const mockAnimatedExercise = {
      ...mockExercise,
      startAnimation: vi.fn()
    } as unknown as AnimatedExercise;
    
    // Run exercise
    renderView.run(mockAnimatedExercise);
    // Verify
    expect(ExerciseMetadata.isAnimated).toHaveBeenCalledWith(mockAnimatedExercise);
    expect(mockAnimatedExercise.startAnimation).toHaveBeenCalledWith(renderView);
  });
  
  it('should update renderer', () => {
    const mockAnimatedExercise = {
      ...mockExercise,
      startAnimation: vi.fn()
    } as unknown as AnimatedExercise;
    
    // Setup mock exercise
    renderView.run(mockAnimatedExercise);

    // Call update
    renderView.update();

    // Verify that render was called with the exercise scene and camera
    expect(renderView.renderer.render).toHaveBeenCalledWith(mockExercise.scene, mockExercise.camera);
  });
  
  it('should update size', () => {
    // Call updateSize
    renderView.updateSize();

    // Verify size was set correctly
    expect(renderView.renderer.setSize).toHaveBeenCalledWith(1920, 1080);
    expect(renderView.renderer.setPixelRatio).toHaveBeenCalledWith(Math.min(window.devicePixelRatio, 2));
  });
  
  it('should set render configuration', () => {
    // Define render config
    const renderConfig = {
      shadowMapType: PCFShadowMap,
      tone: {
        mapping: NoToneMapping,
        exposure: 2
      },
      clearColor: '#ffffff'
    };
    
    // Call setRender
    renderView.setRender(renderConfig);

    // Verify all configurations were set
    expect(renderView.renderer.shadowMap.enabled).toBe(true);
    expect(renderView.renderer.shadowMap.type).toBe(PCFShadowMap);
    expect(renderView.renderer.toneMapping).toBe(NoToneMapping);
    expect(renderView.renderer.toneMappingExposure).toBe(2);
    expect(renderView.renderer.setClearColor).toHaveBeenCalledWith('#ffffff');
  });
  
  it('should enable shadows', () => {
    // Call enableShadows
    renderView.enableShadows(PCFShadowMap);

    // Verify shadow settings
    expect(renderView.renderer.shadowMap.enabled).toBe(true);
    expect(renderView.renderer.shadowMap.type).toBe(PCFShadowMap);
  });
  
  it('should reset renderer', () => {
    // Call reset
    renderView.reset();

    // Verify all properties were reset to defaults
    expect(renderView.renderer.shadowMap.enabled).toBe(false);
    expect(renderView.renderer.shadowMap.type).toBe(PCFShadowMap);
    expect(renderView.renderer.toneMapping).toBe(NoToneMapping);
    expect(renderView.renderer.toneMappingExposure).toBe(1);
    expect(renderView.renderer.setClearColor).toHaveBeenCalledOnce();
  });
  
  it('should return renderer', () => {
    expect(renderView.renderer).toBeDefined();
  });
  
  it('should return canvas height', () => {
    // Set clientHeight
    Object.defineProperty(window, 'innerHeight', { value: 500 });
    
    // Verify
    expect(renderView.height).toBe(500);
  });
});
