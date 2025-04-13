import { expect, describe, it, vi, beforeEach } from 'vitest';

import { Timer } from 'three/addons/misc/Timer.js';

import { initDebugMetadata, DebugFPS } from '../debug';


describe('initDebugMetadata', () => {
  let mockContext: ClassDecoratorContext | ClassMethodDecoratorContext | ClassFieldDecoratorContext;
  
  beforeEach(() => {
    mockContext = {
      name: 'testMethod',
      metadata: {}
    } as unknown as ClassMethodDecoratorContext;
  });

  it('should initialize metadata with default values when none exist', () => {
    const result = initDebugMetadata(mockContext);
    
    expect(result).toBeDefined();
    expect(result.isDebuggable).toBe(true);
    expect(result.shouldSendData).toBe(false);
  });

  it('should not override existing metadata values', () => {
    // Setup existing metadata
    const contextWithExistingMetadata = {
      name: 'testMethod',
      metadata: {
        isDebuggable: false,
        shouldSendData: true
      }
    } as unknown as ClassMethodDecoratorContext;
    
    const result = initDebugMetadata(contextWithExistingMetadata);
    
    expect(result).toBeDefined();
    expect(result.isDebuggable).toBe(false); // Should preserve existing value
    expect(result.shouldSendData).toBe(true); // Should preserve existing value
  });
});

describe('DebugFPS', () => {
  let mockContext: ClassMethodDecoratorContext;
  let originalMethod: ReturnType<typeof vi.fn>;
  let mockInstance: EventTarget & { dispatchEvent: ReturnType<typeof vi.fn> };
  let timer: Timer;

  beforeEach(() => {
    mockInstance = {
      dispatchEvent: vi.fn()
    } as unknown as EventTarget & { dispatchEvent: ReturnType<typeof vi.fn> };

    mockContext = {
      name: 'render',
      metadata: {}
    } as unknown as ClassMethodDecoratorContext;
    
    // Setup mock method
    originalMethod = vi.fn();
    timer = {
      getDelta: () => 0.016
    } as Timer;
    
  });

  it('should call the original method', () => {
    const decoratedMethod = DebugFPS(originalMethod, mockContext);
    decoratedMethod.call(mockInstance, timer);
    expect(originalMethod).toHaveBeenCalledWith(timer);
  });

  it('should not dispatch event when shouldSendData is false', () => {
    const contextWithMetadata = {
      name: 'render',
      metadata: {
        isDebuggable: true,
        shouldSendData: false
      }
    } as unknown as ClassMethodDecoratorContext;
    
    const decoratedMethod = DebugFPS(originalMethod, contextWithMetadata);
    
    decoratedMethod.call(mockInstance, timer);
    
    expect(mockInstance.dispatchEvent).not.toHaveBeenCalled();
  });

  it('should dispatch FPS data when shouldSendData is true', () => {
    const contextWithMetadata = {
      name: 'render',
      metadata: {
        isDebuggable: true,
        shouldSendData: true
      }
    } as unknown as ClassMethodDecoratorContext;
    
    const decoratedMethod = DebugFPS(originalMethod, contextWithMetadata);
    
    decoratedMethod.call(mockInstance, timer);
    
    expect(mockInstance.dispatchEvent).toHaveBeenCalledTimes(1);
    
    // Check the event has the correct type and data
    const callArgs = mockInstance.dispatchEvent.mock.calls[0][0];
    expect(callArgs).toBeInstanceOf(CustomEvent);
    expect(callArgs.type).toBe('debug-info');
    expect(callArgs.detail).toHaveProperty('fps');
    expect(callArgs.detail.fps).toBe(1 / 0.016); // ~62.5
  });

  it('should preserve the this context when calling the original method', () => {
    const mockThis = {
      ...mockInstance,
      someProperty: 'test',
      someMethod: vi.fn()
    };
    
    const testMethod = function(this: typeof mockThis, _timer: Timer) {
      this.someMethod();
      return this.someProperty;
    };
    
    const decoratedMethod = DebugFPS(testMethod, mockContext);
    
    decoratedMethod.call(mockThis, timer);
    
    expect(mockThis.someMethod).toHaveBeenCalledTimes(1);
  });
}); 