import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Action, Exercise } from '#/app/types/exercise';
import * as ExerciseMetadata from '#/app/utils/exercise-metadata';

import { ActionBar } from '../action-bar';




function getActionBarContainer(): HTMLElement {
  return document.querySelector('#action-bar-container') as HTMLElement;
}

function getActionButtons(): HTMLButtonElement[] {
  return Array.from(getActionBarContainer().querySelectorAll('button'));
}

// Mock the exercise metadata utils
vi.mock('#/app/utils/exercise-metadata', () => ({
  getActions: vi.fn()
}));


describe('ActionBar', () => {
  let actionBar: ActionBar;
  let parent: HTMLDivElement;
  
  beforeEach(() => {

    document.body.innerHTML = '';
    vi.clearAllMocks();
    
    // Setup
    actionBar = new ActionBar();
    parent = document.createElement('div');
    document.body.appendChild(parent);
    actionBar.addTo(parent);
  });
  
  it('should create and initialize the action bar with no buttons', () => {
    const actionBarContainer = document.querySelector('#action-bar-container');
    expect(actionBarContainer).not.toBeNull();

    const buttons = actionBarContainer!.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('should add a button with an action', () => {
    // Setup
    const mockAction: Action = {
      icon: '<svg>Icon</svg>',
      label: 'Test Action',
      onClick: vi.fn()
    };
    
    const mockExercise = {} as Exercise;
    
    // Add button
    actionBar.addButton(mockAction, mockExercise);
    
    // Verify button was added
    const buttons = getActionButtons();
    expect(buttons.length).toBe(1);
    expect(buttons[0].innerHTML).toBe(mockAction.icon);
    expect(buttons[0].getAttribute('title')).toBe(mockAction.label);
    
    // Verify clicking the button triggers the action
    buttons[0].click();
    expect(mockAction.onClick).toHaveBeenCalled();
  });
  
  it('should reset by removing buttons from DOM', () => {
    // Setup - add two buttons
    const mockAction: Action = {
      icon: '<svg>Icon</svg>',
      label: 'Test Action',
      onClick: vi.fn()
    };
    
    const mockExercise = {} as Exercise;
    const mockRemove = vi.fn();

    actionBar.addButton(mockAction, mockExercise);
    actionBar.addButton(mockAction, mockExercise);
    
    // Verify buttons were added
    expect(getActionButtons().length).toBe(2);
    
    // Mock remove method on buttons
    getActionButtons().forEach(button => {
      button.remove = mockRemove;
    });
    
    // Reset
    actionBar.reset();
    
    // The reset method calls remove() on each button but doesn't empty the array
    // Verify each button's remove method was called
    getActionButtons().forEach(button => {
      expect(button.remove).toHaveBeenCalled();
    });
  });
  
  it('should update content with actions from exercise', () => {
    // Setup mock exercise and actions
    const mockExercise = {} as Exercise;
    const mockActions: Action[] = [
      {
        icon: '<svg>Icon1</svg>',
        label: 'Action 1',
        onClick: vi.fn()
      },
      {
        icon: '<svg>Icon2</svg>',
        label: 'Action 2',
        onClick: vi.fn()
      }
    ];
    
    // Mock getActions to return our mock actions
    vi.mocked(ExerciseMetadata.getActions).mockReturnValue(mockActions);
    
    // Update content
    actionBar.updateContent(mockExercise);
    
    // Verify getActions was called
    expect(ExerciseMetadata.getActions).toHaveBeenCalledWith(mockExercise);
    
    // Verify buttons were added for each action
    const buttons = getActionButtons();
    expect(buttons.length).toBe(2);
    expect(buttons[0].innerHTML).toBe(mockActions[0].icon);
    expect(buttons[1].innerHTML).toBe(mockActions[1].icon);
  });
});
