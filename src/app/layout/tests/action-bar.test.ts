import { describe, it, expect, beforeEach, vi } from 'vitest';

import { DropDownMenu } from '../../components/drop-down-menu';
import { ButtonAction, Exercise, SelectableAction } from '../../types/exercise';
import * as ExerciseMetadata from '../../utils/exercise-metadata';
import { ActionBar } from '../action-bar';

// Mock the DropDownMenu class
vi.mock('../../components/drop-down-menu', () => {
  return {
    DropDownMenu: vi.fn().mockImplementation(() => ({
      addTo: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      remove: vi.fn(),
      setValue: vi.fn(),
      getValue: vi.fn().mockReturnValue('default-value')
    }))
  };
});

function getActionBarContainer(): HTMLElement {
  return document.querySelector('#action-bar-container') as HTMLElement;
}

function getActionButtons(): HTMLButtonElement[] {
  return Array.from(getActionBarContainer().querySelectorAll('button'));
}

// Mock the exercise metadata utils
vi.mock('../../utils/exercise-metadata', () => ({
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
    const mockAction: ButtonAction = {
      type: 'button',
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
  
  it('should add a selectable with options', () => {
    // Setup
    const mockOptions = { 'Option 1': 'value1', 'Option 2': 'value2' };
    const mockOnChange = vi.fn();
    
    const mockAction: SelectableAction = {
      type: 'selectable',
      label: 'Test Selectable',
      options: mockOptions,
      defaultValue: 'value1',
      onChange: mockOnChange
    };
    
    const mockExercise = {} as Exercise;
    
    // Add selectable
    actionBar.addSelectable(mockAction, mockExercise);
    
    // Verify DropDownMenu was created with correct parameters
    expect(DropDownMenu).toHaveBeenCalledWith(
      'action-bar-selectable-Test Selectable', 
      {
        label: 'Test Selectable',
        options: mockOptions,
        classes: 'col-span-4'
      }
    );
    
    // Verify it was added to container and default value was set
    const dropDownMenu = vi.mocked(DropDownMenu).mock.results[0].value;
    expect(dropDownMenu.addTo).toHaveBeenCalledWith(getActionBarContainer());
    expect(dropDownMenu.setValue).toHaveBeenCalledWith('value1');
    expect(dropDownMenu.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
  
  it('should trigger onChange when selectable value changes', () => {
    // Setup
    const mockOnChange = vi.fn();
    const mockAction: SelectableAction = {
      type: 'selectable',
      label: 'Test Selectable',
      options: { 'Option 1': 'value1', 'Option 2': 'value2' },
      defaultValue: 'value1',
      onChange: mockOnChange
    };
    
    const mockExercise = {} as Exercise;
    
    // Add selectable
    actionBar.addSelectable(mockAction, mockExercise);
    
    // Get the registered onChange handler
    const dropDownMenu = vi.mocked(DropDownMenu).mock.results[0].value;
    const changeListener = vi.mocked(dropDownMenu.addEventListener).mock.calls[0][1];
    
    // Trigger the change event
    const customEvent = new CustomEvent('change', { detail: { value: 'value2' } });
    (changeListener as EventListener)(customEvent);
    
    // Verify the onChange handler was called with the right value
    expect(mockOnChange).toHaveBeenCalledWith('value2');
  });
  
  it('should reset by removing buttons from DOM', () => {
    // Setup - add two buttons
    const mockAction: ButtonAction = {
      type: 'button',
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
    const mockActions: ButtonAction[] = [
      {
        type: 'button',
        icon: '<svg>Icon1</svg>',
        label: 'Action 1',
        onClick: vi.fn()
      },
      {
        type: 'button',
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

  it('should update content with mixed button and selectable actions', () => {
    // Setup mock exercise and actions
    const mockExercise = {} as Exercise;
    const mockButtonAction: ButtonAction = {
      type: 'button',
      icon: '<svg>Icon</svg>',
      label: 'Button Action',
      onClick: vi.fn()
    };
    
    const mockSelectableAction: SelectableAction = {
      type: 'selectable',
      label: 'Selectable Action',
      options: { 'Option 1': 'value1', 'Option 2': 'value2' },
      defaultValue: 'value1',
      onChange: vi.fn()
    };
    
    const mockActions = [mockButtonAction, mockSelectableAction];
    
    // Spy on the addButton and addSelectable methods
    const addButtonSpy = vi.spyOn(actionBar, 'addButton');
    const addSelectableSpy = vi.spyOn(actionBar, 'addSelectable');
    
    // Mock getActions to return our mixed actions
    vi.mocked(ExerciseMetadata.getActions).mockReturnValue(mockActions);
    
    // Update content
    actionBar.updateContent(mockExercise);
    
    // Verify each type of action was handled correctly
    expect(addButtonSpy).toHaveBeenCalledWith(mockButtonAction, mockExercise);
    expect(addSelectableSpy).toHaveBeenCalledWith(mockSelectableAction, mockExercise);
  });

  it('should cleanup event listeners when resetting', () => {
    // Add button action
    const mockButtonAction: ButtonAction = {
      type: 'button',
      icon: '<svg>Icon</svg>',
      label: 'Button Action',
      onClick: vi.fn()
    };
    
    // Add selectable action
    const mockSelectableAction: SelectableAction = {
      type: 'selectable',
      label: 'Selectable Action',
      options: { 'Option 1': 'value1', 'Option 2': 'value2' },
      defaultValue: 'value1',
      onChange: vi.fn()
    };
    
    const mockExercise = {} as Exercise;
    
    actionBar.addButton(mockButtonAction, mockExercise);
    actionBar.addSelectable(mockSelectableAction, mockExercise);
    
    // Get references to the elements
    const button = getActionButtons()[0];
    const dropDownMenu = vi.mocked(DropDownMenu).mock.results[0].value;
    
    // Spy on removeEventListener methods
    const buttonRemoveEventListenerSpy = vi.spyOn(button, 'removeEventListener');
    
    // Reset
    actionBar.reset();
    
    // Verify event listeners were removed
    expect(buttonRemoveEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Verify the DropDownMenu was removed but don't check removeEventListener 
    // since it's handled internally by the DropDownMenu's remove method
    expect(dropDownMenu.remove).toHaveBeenCalled();
  });
});
