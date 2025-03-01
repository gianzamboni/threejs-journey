import { beforeEach, describe, expect, it, vi } from "vitest";
import { ControllerFactory } from "..";
import { GUI } from "lil-gui";
import { ExerciseMetadata } from "@/app/utils/exercise-metadata";
import { TestExercise } from "./test-exercise";
import { ControllerConfig } from "@/app/decorators/customizable";

describe('ControllerFactory', () => {
  let gui: GUI;
  let exercise: TestExercise;
  let controllerFactory: ControllerFactory;
  
  beforeEach(() => {
    vi.resetAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Setup for each test
    gui = new GUI();
    exercise = new TestExercise();
    controllerFactory = new ControllerFactory(gui, exercise);
  });

  it('should create a controller for a property', () => {
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [{
      propertyPath: 'visible',
    }] });
    
    controllerFactory.create();

    // Verify the controller was created correctly
    expect(ExerciseMetadata.getControllers).toHaveBeenCalledWith(exercise);
    
    expect(gui.folders.length).toBe(0);
    const controllers = gui.controllers;

    expect(controllers.length).toBe(1);
    expect(controllers[0]._name).toBe('Visible');
    expect(controllers[0].object).toBe(exercise.getCube());
  });

  it('should create a controller for nested properties correctly', () => {
    const config = {
      propertyPath: 'position.y',
    }

    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [config] });

    controllerFactory.create();

    expect(gui.folders.length).toBe(0);
    const controllers = gui.controllers;

    expect(controllers.length).toBe(1);
    expect(controllers[0]._name).toBe('Y');
    expect(controllers[0].object).toBe(exercise.getCube().position);
  });

  it('should put controllers inside a folder if folderPath is provided', () => {
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [{
      propertyPath: 'visible',
      folderPath: 'Awesome Cube'
    }] });

    controllerFactory.create();
    
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe('Awesome Cube');

    const controllers = gui.folders[0].controllers;

    expect(controllers.length).toBe(1);
    expect(controllers[0]._name).toBe('Visible');
    expect(controllers[0].object).toBe(exercise.getCube());
  });

  it('should use debugObject if settings.onChange or settings.onFinishChange is provided', () => {
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [{
      propertyPath: 'visible',
      settings: {
        onChange: 'getCube'
      }
    }]});

    controllerFactory.create();
    
    expect(gui.folders.length).toBe(0);
    const controllers = gui.controllers;

    expect(controllers.length).toBe(1);
    expect(controllers[0]._name).toBe('Visible');
    expect(controllers[0].object).toBe((exercise as any)._ControllerFactory_debugObject.cube);
  });

  it('should create nested folders correctly', () => {
    const nestedFolderConfig = {
      propertyPath: 'visible',
      folderPath: 'Parent/Child/Grandchild'
    };
    
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [nestedFolderConfig] });
    
    controllerFactory.create();
    
    // Verify nested folders were created
    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe('Parent');
    expect(gui.folders[0].folders.length).toBe(1);
    expect(gui.folders[0].folders[0]._title).toBe('Child');
    expect(gui.folders[0].folders[0].folders.length).toBe(1);
    expect(gui.folders[0].folders[0].folders[0]._title).toBe('Grandchild');
    expect(gui.folders[0].folders[0].folders[0].controllers.length).toBe(1);
  });

  it('should apply controller settings correctly', () => {
    const configWithSettings = {
      propertyPath: 'position.y',
      settings: {
        min: -5,
        max: 5,
        step: 0.1,
        name: 'Custom Name'
      }
    };
    
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': [configWithSettings] });
    controllerFactory.create();
    
    // Verify settings were applied
    expect(gui.controllers.length).toBe(1);
    expect(gui.controllers[0]._name).toBe('Custom Name');
    
  });

  it('should handle multiple controllers for the same property', () => {
    const multipleConfigs = [
      {
        propertyPath: 'position.y',
        folderPath: 'Folder 1',
        settings: {
          name: 'Y Position 1'
        }
      },
      {
        propertyPath: 'visible',
        folderPath: 'Folder 2',
      }
    ];
    
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': multipleConfigs });
    
    controllerFactory.create();
    
    // Verify multiple controllers were created
    expect(gui.folders.length).toBe(2);
    expect(gui.folders[0]._title).toBe('Folder 1');
    expect(gui.folders[1]._title).toBe('Folder 2');
    expect(gui.folders[0].controllers.length).toBe(1);
    expect(gui.folders[1].controllers.length).toBe(1);
    expect(gui.folders[0].controllers[0]._name).toBe('Y Position 1');
    expect(gui.folders[1].controllers[0]._name).toBe('Visible');
  });

  it('should handle master controllers that enable/disable other controllers in the same folder', () => {
    // Create a master controller and regular controllers in the same folder
    const configs: ControllerConfig[] = [
      {
        propertyPath: 'visible',
        folderPath: 'Test Folder',
        type: 'master',
        initialValue: true,
        settings: {
          name: 'On/Off'
        }
      },
      {
        propertyPath: 'position.y',
        folderPath: 'Test Folder',
        settings: {
          name: 'Y Position'
        }
      }
    ];
        
    vi.spyOn(ExerciseMetadata, 'getControllers').mockReturnValue({ 'cube': configs });

    controllerFactory.create();

    expect(gui.folders.length).toBe(1);
    expect(gui.folders[0]._title).toBe('Test Folder');
    expect(gui.folders[0].controllers.length).toBe(2);

    const onOffController = gui.folders[0].controllers[0];
    const yPositionController = gui.folders[0].controllers[1];

    expect(onOffController._name).toBe('On/Off');
    expect(yPositionController._name).toBe('Y Position');

    onOffController._onChange(false);

    expect(yPositionController._disabled).toBe(true);
    expect(onOffController._disabled).toBe(false);

    onOffController._onChange(true);

    expect(yPositionController._disabled).toBe(false);
    expect(onOffController._disabled).toBe(false);
  });
});
