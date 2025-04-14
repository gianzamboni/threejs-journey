import GUI from 'lil-gui';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Exercise } from '#/app/types/exercise';
import * as ExerciseMetadata from '#/app/utils/exercise-metadata';
import { ControllerFactory } from './controller-factory';
import { GraphPanel } from './graph-panel';
import DebugUI from './index';

// Mock dependencies
vi.mock('lil-gui');
vi.mock('./graph-panel');
vi.mock('./controller-factory');
vi.mock('#/app/utils/exercise-metadata');

describe('DebugUI', () => {
  let debugUI: DebugUI;
  let parent: HTMLElement;
  let mockExercise: Exercise;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Create a new DebugUI instance for each test
    debugUI = new DebugUI();
    
    // Create a parent element for adding the debug UI
    parent = document.createElement('div');
    
    // Create a mock exercise
    mockExercise = {} as unknown as Exercise;
    
    // Mock exercise metadata functions
    vi.mocked(ExerciseMetadata.isDebuggable).mockReturnValue(true);
    vi.mocked(ExerciseMetadata.hasControllers).mockReturnValue(false);
    vi.mocked(ExerciseMetadata.getMetadata).mockReturnValue({});
  });

  it('should create a container div on initialization', () => {
    expect(debugUI['container']).toBeInstanceOf(HTMLDivElement);
    expect(debugUI['container'].className).toContain('hidden');
  });

  it('should add the container to the parent element', () => {
    debugUI.addTo(parent);
    expect(parent.children).toContain(debugUI['container']);
  });

  describe('toggle', () => {
    it('should do nothing if the exercise is not debuggable', () => {
      vi.mocked(ExerciseMetadata.isDebuggable).mockReturnValue(false);
      
      const container = debugUI['container'];
      const toggleSpy = vi.spyOn(container.classList, 'toggle');
      
      debugUI.toggle(mockExercise);
      
      expect(toggleSpy).not.toHaveBeenCalled();
    });

    it('should toggle the hidden class on the container', () => {
      const container = debugUI['container'];
      const toggleSpy = vi.spyOn(container.classList, 'toggle');
      
      debugUI.toggle(mockExercise);
      
      expect(toggleSpy).toHaveBeenCalledWith('hidden');
    });

    it('should update the shouldSendData metadata property correctly when shown', () => {
      const mockMetadata = { shouldSendData: false };
      vi.mocked(ExerciseMetadata.getMetadata).mockReturnValue(mockMetadata);
      
      // Mock container.classList.contains to return false (meaning UI is visible)
      vi.spyOn(debugUI['container'].classList, 'contains').mockReturnValue(false);
      
      debugUI.toggle(mockExercise);
      
      expect(mockMetadata.shouldSendData).toBe(true);
    });

    it('should update the shouldSendData metadata property correctly when hidden', () => {
      const mockMetadata = { shouldSendData: true };
      vi.mocked(ExerciseMetadata.getMetadata).mockReturnValue(mockMetadata);
      
      // Mock container.classList.contains to return true (meaning UI is hidden)
      vi.spyOn(debugUI['container'].classList, 'contains').mockReturnValue(true);
      
      debugUI.toggle(mockExercise);
      
      expect(mockMetadata.shouldSendData).toBe(false);
    });
  });

  describe('update', () => {
    it('should update data rows when sufficient time has passed', () => {
      const nowValue = 2000;
      vi.spyOn(performance, 'now').mockReturnValue(nowValue);
      
      // Set lastGuiUpdate to a time more than 1000ms ago
      debugUI['lastGuiUpdate'] = nowValue - 1500;
      
      // Create a mock data row
      const mockDataRow = { update: vi.fn() };
      debugUI['dataRows'] = { fps: mockDataRow as unknown as GraphPanel };
      
      debugUI.update({ fps: 60 });
      
      expect(mockDataRow.update).toHaveBeenCalledWith(60);
      expect(debugUI['lastGuiUpdate']).toBe(nowValue);
    });

    it('should not update data rows when insufficient time has passed', () => {
      const nowValue = 2000;
      vi.spyOn(performance, 'now').mockReturnValue(nowValue);
      
      // Set lastGuiUpdate to a time less than 1000ms ago
      debugUI['lastGuiUpdate'] = nowValue - 500;
      
      // Create a mock data row
      const mockDataRow = { update: vi.fn() };
      debugUI['dataRows'] = { fps: mockDataRow as unknown as GraphPanel };
      
      debugUI.update({ fps: 60 });
      
      expect(mockDataRow.update).not.toHaveBeenCalled();
      expect(debugUI['lastGuiUpdate']).toBe(nowValue - 500);
    });

    it('should create a new data row when key does not exist', () => {
      const nowValue = 2000;
      vi.spyOn(performance, 'now').mockReturnValue(nowValue);
      
      // Set lastGuiUpdate to a time more than 1000ms ago
      debugUI['lastGuiUpdate'] = nowValue - 1500;
      
      // Mock GraphPanel constructor and methods
      const mockGraphPanel = { update: vi.fn() };
      vi.mocked(GraphPanel).mockImplementation(() => mockGraphPanel as unknown as GraphPanel);
      
      debugUI.update({ fps: 60 });
      
      expect(GraphPanel).toHaveBeenCalledWith('FPS', debugUI['container']);
      expect(mockGraphPanel.update).toHaveBeenCalledWith(60);
      expect(debugUI['dataRows'].fps).toBe(mockGraphPanel);
    });

    it('should throw an error for unknown data row key', () => {
      const nowValue = 2000;
      vi.spyOn(performance, 'now').mockReturnValue(nowValue);
      
      // Set lastGuiUpdate to a time more than 1000ms ago
      debugUI['lastGuiUpdate'] = nowValue - 1500;
      
      expect(() => debugUI.update({ unknownKey: 60 })).toThrow('Unknown key: unknownKey');
    });
  });

  describe('gui getter', () => {
    it('should create a new GUI instance if none exists', () => {
      const mockGui = {};
      vi.mocked(GUI).mockImplementation(() => mockGui as unknown as GUI);
      
      const gui = debugUI.gui;
      
      expect(GUI).toHaveBeenCalledWith({
        title: 'Settings',
        closeFolders: true,
        container: debugUI['container']
      });
      expect(gui).toBe(mockGui);
      expect(debugUI['lilGui']).toBe(mockGui);
    });

    it('should return the existing GUI instance if one exists', () => {
      const mockGui = {};
      debugUI['lilGui'] = mockGui as unknown as GUI;
      
      const gui = debugUI.gui;
      
      expect(GUI).not.toHaveBeenCalled();
      expect(gui).toBe(mockGui);
    });
  });

  describe('reset', () => {
    it('should hide the container', () => {
      debugUI.reset();
      expect(debugUI['container'].classList.contains('hidden')).toBe(true);
    });

    it('should dispose all data rows', () => {
      const mockDataRow1 = { dispose: vi.fn() };
      const mockDataRow2 = { dispose: vi.fn() };
      
      debugUI['dataRows'] = {
        fps: mockDataRow1 as unknown as GraphPanel,
        memory: mockDataRow2 as unknown as GraphPanel
      };
      
      debugUI.reset();
      
      expect(mockDataRow1.dispose).toHaveBeenCalled();
      expect(mockDataRow2.dispose).toHaveBeenCalled();
      expect(debugUI['dataRows']).toEqual({});
    });

    it('should destroy all controllers and the GUI', () => {
      const mockController1 = { destroy: vi.fn() };
      const mockController2 = { destroy: vi.fn() };
      
      const mockGui = {
        controllersRecursive: vi.fn().mockReturnValue([mockController1, mockController2]),
        destroy: vi.fn()
      };
      
      debugUI['lilGui'] = mockGui as unknown as GUI;
      
      debugUI.reset();
      
      expect(mockController1.destroy).toHaveBeenCalled();
      expect(mockController2.destroy).toHaveBeenCalled();
      expect(mockGui.destroy).toHaveBeenCalled();
      expect(debugUI['lilGui']).toBeNull();
    });
  });

  describe('createControllers', () => {
    it('should do nothing if exercise has no controllers', () => {
      vi.mocked(ExerciseMetadata.hasControllers).mockReturnValue(false);
      
      debugUI.createControllers(mockExercise);
      
      expect(ControllerFactory).not.toHaveBeenCalled();
    });

    it('should create controllers if exercise has controllers', () => {
      vi.mocked(ExerciseMetadata.hasControllers).mockReturnValue(true);
      
      const mockGuiInstance = {};
      vi.mocked(GUI).mockImplementation(() => mockGuiInstance as unknown as GUI);
      
      const mockControllerFactory = { create: vi.fn() };
      vi.mocked(ControllerFactory).mockImplementation(() => mockControllerFactory as unknown as ControllerFactory);
      
      debugUI.createControllers(mockExercise);
      
      expect(ControllerFactory).toHaveBeenCalledWith(expect.anything(), mockExercise);
      expect(mockControllerFactory.create).toHaveBeenCalled();
    });
  });
});
