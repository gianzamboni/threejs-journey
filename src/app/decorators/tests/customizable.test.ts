import { expect, describe, it, vi, beforeEach } from 'vitest';

import { Customizable, Callable, type ControllerConfig, type ExerciseControllers } from '../customizable';

describe('Customizable decorator', () => {
  let mockMetadata: { controllersConfig?: ExerciseControllers };
  let mockContext: ClassFieldDecoratorContext;

  beforeEach(() => {
    mockMetadata = {};

    mockContext = {
      name: 'testProperty',
      metadata: mockMetadata
    } as unknown as ClassFieldDecoratorContext;
  });

  it('should add controllers to metadata with empty initial state', () => {
    const controllers: ControllerConfig[] = [
      { type: 'color', folderPath: 'test-folder' }
    ];

    const decorator = Customizable(controllers);
    decorator(undefined, mockContext);

    expect(mockMetadata.controllersConfig).toBeDefined();
    expect(mockMetadata.controllersConfig!['testProperty']).toEqual(controllers);
  });

  it('should append to existing controllers for the same property', () => {
    const existingControllers: ControllerConfig[] = [
      { type: 'color', folderPath: 'existing-folder' }
    ];
    
    const newControllers: ControllerConfig[] = [
      { type: 'callable', folderPath: 'new-folder' }
    ];

    mockMetadata.controllersConfig = {
      'testProperty': [...existingControllers]
    };

    const decorator = Customizable(newControllers);
    decorator(undefined, mockContext);

    expect(mockMetadata.controllersConfig!['testProperty']).toEqual([
      ...existingControllers,
      ...newControllers
    ]);
  });
});

describe('Callable decorator', () => {
  let mockMetadata: { controllersConfig?: ExerciseControllers };
  let mockContext: ClassMethodDecoratorContext;

  beforeEach(() => {
    mockMetadata = {};

    mockContext = {
      name: 'testMethod',
      metadata: mockMetadata
    } as unknown as ClassMethodDecoratorContext;
  });

  it('should add callable controller to metadata', () => {
    const folderPath = 'test-folder';
    const name = 'Test Button';

    const decorator = Callable(folderPath, name);
    decorator(vi.fn() as unknown as VoidFunction, mockContext);

    expect(mockMetadata.controllersConfig).toBeDefined();
    
    const expectedController: ControllerConfig = { 
      type: 'callable', 
      folderPath, 
      settings: { name },
      context: {
        callableArgs: []
      } 
    };
    
    expect(mockMetadata.controllersConfig!['testMethod']).toEqual([expectedController]);
  });
});

// Testing behavior of addControllersToMetadata through the decorators
describe('Controller metadata management', () => {
  let mockMetadata: { controllersConfig?: ExerciseControllers };

  beforeEach(() => {
    mockMetadata = {};
  });

  it('should initialize metadata for the first controller', () => {
    const mockContext = {
      name: 'testProperty',
      metadata: mockMetadata,
    } as unknown as ClassFieldDecoratorContext;

    const controllers: ControllerConfig[] = [{ type: 'color' }];
    const decorator = Customizable(controllers);
    decorator(undefined, mockContext);

    expect(mockMetadata.controllersConfig).toBeDefined();
    expect(typeof mockMetadata.controllersConfig).toBe('object');
  });

  it('should handle multiple controllers for different properties', () => {
    const fieldContext = {
      name: 'testField',
      metadata: mockMetadata,
      addInitializer: vi.fn()
    } as unknown as ClassFieldDecoratorContext;

    const methodContext = {
      name: 'testMethod',
      metadata: mockMetadata,
      addInitializer: vi.fn()
    } as unknown as ClassMethodDecoratorContext;

    // Add a controller for the field
    const fieldControllers: ControllerConfig[] = [{ type: 'color' }];
    const fieldDecorator = Customizable(fieldControllers);
    fieldDecorator(undefined, fieldContext);

    // Add a controller for the method
    const methodDecorator = Callable('test-folder', 'Test');
    methodDecorator(vi.fn() as unknown as VoidFunction, methodContext);

    // Both should be in the metadata
    expect(mockMetadata.controllersConfig!['testField']).toHaveLength(1);
    expect(mockMetadata.controllersConfig!['testMethod']).toHaveLength(1);
    expect(Object.keys(mockMetadata.controllersConfig!).length).toBe(2);
  });
});

// Testing the type definitions work as expected
describe('Type definitions', () => {
  it('should properly define ControllerConfig types', () => {
    const colorConfig: ControllerConfig = {
      type: 'color',
      folderPath: 'colors',
      settings: {
        name: 'My Color',
        min: 0,
        max: 1,
        step: 0.1
      }
    };
    
    const callableConfig: ControllerConfig = {
      type: 'callable',
      folderPath: 'actions',
      settings: {
        name: 'Run Action'
      }
    };
    
    const masterConfig: ControllerConfig = {
      type: 'master',
      folderPath: 'master',
      settings: {
        name: 'Main Control'
      }
    };
    
    // Test the type union works
    const configs: ControllerConfig[] = [colorConfig, callableConfig, masterConfig];
    expect(configs).toHaveLength(3);
    
    // Test onChange property can be a string (method name)
    const configWithCallback: ControllerConfig = {
      settings: {
        onChange: 'handleColorChange'
      }
    };
    expect(typeof configWithCallback.settings!.onChange).toBe('string');
  });
}); 