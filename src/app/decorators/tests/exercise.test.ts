import { expect, describe, it, vi, beforeEach } from 'vitest';

import { Action, ExerciseClass } from '#/app/types/exercise';

import { 
  Exercise,
  Description,
  WithOrbitControllerDescription,
  IsAnimated,
  ActionButton
} from '../exercise';

function createMockContext() {
  return {
    metadata: {}
  } as unknown as ClassDecoratorContext;
}

class MockExercise {}
describe('Exercise decorator', () => {
  let mockContext: ClassDecoratorContext;
  
  beforeEach(() => {
    mockContext = createMockContext();
  });

  it('should add id to metadata', () => {
    const decorator = Exercise('test-id');
    decorator(MockExercise as unknown as ExerciseClass, mockContext);
    
    expect(mockContext.metadata.id).toBe('test-id');
  });
});

describe('Description decorator', () => {
  let mockContext: ClassDecoratorContext;
  
  beforeEach(() => {
    mockContext = createMockContext();
  })

  it('should initialize descriptions array if undefined', () => {
    const decorator = Description('desc1');
    
    decorator(MockExercise as unknown as ExerciseClass, mockContext);
    
    expect(Array.isArray(mockContext.metadata.descriptions)).toBe(true);
    expect(mockContext.metadata.descriptions).toHaveLength(1);
  });

  it('should handle multiple calls by prepending newer descriptions', () => {
    // First call
    const decorator1 = Description('desc1', 'desc2');
    decorator1(MockExercise as unknown as ExerciseClass, mockContext);
    
    // Second call
    const decorator2 = Description('desc3', 'desc4');
    decorator2(MockExercise as unknown as ExerciseClass, mockContext);
    
    // Check the actual order based on how unshift works
    const descriptions = mockContext.metadata.descriptions as string[];
    expect(descriptions.length).toBe(4);
    // Check position of each description
    expect(descriptions[0]).toBe('desc3');
    expect(descriptions[1]).toBe('desc4');
    expect(descriptions[2]).toBe('desc1'); 
    expect(descriptions[3]).toBe('desc2');
  });
});

describe('WithOrbitControllerDescription decorator', () => {
  let mockContext: ClassDecoratorContext;
  
  beforeEach(() => {
    mockContext = createMockContext();
  });

  it('should set orbitControllerDescription flag in metadata', () => {
    WithOrbitControllerDescription(MockExercise as unknown as ExerciseClass, mockContext);
    expect(mockContext.metadata.orbitControllerDescription).toBe(true);
  });
});

describe('IsAnimated decorator', () => {
  let mockContext: ClassDecoratorContext;
  
  beforeEach(() => {
    mockContext = createMockContext();
  });

  it('should set isAnimated flag in metadata', () => {
    IsAnimated(MockExercise as unknown as ExerciseClass, mockContext);
    
    expect(mockContext.metadata.isAnimated).toBe(true);
  });
});

describe('ActionButton decorator', () => {
  let mockContext: ClassMethodDecoratorContext;
  let mockMethod: () => void;
  
  beforeEach(() => {
    mockMethod = vi.fn();
    mockContext = {
      name: 'testAction',
      metadata: {}
    } as unknown as ClassMethodDecoratorContext;
  });

  it('should initialize actions array if undefined', () => {
    const decorator = ActionButton('Test Button', 'test-icon');
    decorator(mockMethod, mockContext);
    
    const actions = mockContext.metadata.actions as Action[];
    expect(Array.isArray(actions)).toBe(true);
  });

  it('should add action to metadata with label and icon', () => {
    const decorator = ActionButton('Test Button', 'test-icon');
    decorator(mockMethod, mockContext);
    
    const actions = mockContext.metadata.actions as Action[];
    expect(actions).toBeDefined();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      label: 'Test Button',
      icon: 'test-icon'
    });
  });

  it('should set onClick to the target method', () => {
    const decorator = ActionButton('Test Button', 'test-icon');
    decorator(mockMethod, mockContext);
    
    const actions = mockContext.metadata.actions as Action[];
    expect(actions[0].onClick).toBe(mockMethod);
  });

  it('should add multiple actions when called multiple times', () => {
    // First action
    const decorator1 = ActionButton('Button 1', 'icon-1');
    decorator1(mockMethod, mockContext);
    
    // Second action with a different method
    const anotherMethod = vi.fn();
    const decorator2 = ActionButton('Button 2', 'icon-2');
    decorator2(anotherMethod, mockContext);
    
    const actions = mockContext.metadata.actions as Action[];
    expect(actions).toHaveLength(2);
    expect(actions[0]).toMatchObject({
      label: 'Button 1',
      icon: 'icon-1'
    });
    expect(actions[1]).toMatchObject({
      label: 'Button 2',
      icon: 'icon-2'
    });
  });
});
