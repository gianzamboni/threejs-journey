import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

import { ExerciseClass } from '#/app/types/exercise';
import * as ExerciseMetadata from '#/app/utils/exercise-metadata';

import Menu from '../menu';

// Mock dependencies
vi.mock('#/app/utils/exercise-metadata');

// Mock the getId function to avoid the "Exercise id is undefined" error
vi.mocked(ExerciseMetadata.getId).mockReturnValue('TestExercise');

// Create a properly structured mock for JOURNEY
vi.mock('#/app/journey', () => ({
  JOURNEY: [
    {
      id: 'Section1',
      exercises: [
        { 
          name: 'Exercise1',
          [Symbol.metadata]: { id: 'Exercise1' }
        },
        { 
          name: 'Exercise2',
          [Symbol.metadata]: { id: 'Exercise2' }
        }
      ]
    },
    {
      id: 'Section2',
      exercises: [
        { 
          name: 'Exercise3',
          [Symbol.metadata]: { id: 'Exercise3' }
        }
      ]
    }
  ]
}));

describe('Menu', () => {
  let menu: Menu;
  let mockEventListener: Mock<(event: CustomEvent) => void>;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    mockEventListener = vi.fn();
    // Setup document
    document.body.innerHTML = '';
    
    // Create instance
    menu = new Menu();
    menu.addTo(document.body);
  });
  
  it('should create and initialize the menu correctly', () => {
    const menu = document.querySelector('#exercise-menu');
    expect(menu).not.toBeNull();

    const header = document.querySelector('#exercise-menu-header');
    expect(header).not.toBeNull();

    const footer = document.querySelector('#exercise-menu-footer');
    expect(footer).not.toBeNull();
  });
  
  it('should create a collapsable for each section', () => {
    const collapsables = document.querySelectorAll('.collapsable');
    expect(collapsables).toHaveLength(2);
  });

  it('should create a clickable exercise item for each exercise', () => {
    const exerciseItems = document.querySelectorAll('.exercise-item');
    expect(exerciseItems).toHaveLength(3);
  });

  it('should dispatch an event when an exercise is selected', () => {
    // Create a test exercise with proper metadata
    const mockExercise = { 
      name: 'TestExercise',
      [Symbol.metadata]: { id: 'TestExercise' }
    } as unknown as ExerciseClass;
    
    // Add listener for custom event
    menu.addEventListener('exercise-selected', mockEventListener as unknown as EventListener);
    
    // Create a custom event to simulate selection
    const exerciseSelectedEvent = new CustomEvent('exercise-selected', {
      detail: mockExercise
    });
    
    // Dispatch the event
    menu.dispatchEvent(exerciseSelectedEvent);
    
    // Verify event was dispatched and caught
    expect(mockEventListener).toHaveBeenCalled();
    expect(mockEventListener.mock.calls[0][0].detail).toBe(mockExercise);
  });
  
});