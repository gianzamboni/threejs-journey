import { describe, it, expect, beforeEach, vi } from 'vitest';

import { WarningBox, ErrorData } from '../warning-box';

describe('WarningBox', () => {
  let warningBox: WarningBox;
  let parent: HTMLDivElement;
  
  beforeEach(() => {
    // Setup
    warningBox = new WarningBox();
    parent = document.createElement('div');
    document.body.appendChild(parent);
    warningBox.addTo(parent);
  });
  
  it('should create and initialize the warning box correctly', () => {
    // Initial state check
    const warningBoxElement = parent.querySelector('#warning-box');
    expect(warningBoxElement).not.toBeNull();
    expect(warningBoxElement!.classList.contains('hidden')).toBe(true);

    const actionButton = parent.querySelector('#warning-box-action-button') as HTMLButtonElement;
    expect(actionButton).not.toBeNull();

    const errorContainer = parent.querySelector('#warning-box-error-container');
    expect(errorContainer).not.toBeNull();
  });
  
  it('should set message and show the warning box', () => {
    // Setup
    const mockMessage = document.createElement('span');
    mockMessage.textContent = 'Test error message';
    
    const mockAction = vi.fn();
    
    const errorData: ErrorData = {
      message: mockMessage,
      actionIcon: 'X',
      action: mockAction
    };
    
    // Set message
    warningBox.setMessage(errorData);
    
    // Verify warning box is visible
    const warningBoxElement = parent.querySelector('#warning-box');
    expect(warningBoxElement!.classList.contains('hidden')).toBe(false);
    
    // Verify message content
    expect(warningBoxElement!.textContent).toContain('Test error message');
    
    // Verify action button
    const actionButton = parent.querySelector('#warning-box-action-button') as HTMLButtonElement;
    
    // Verify clicking the button triggers the action and hides the warning
    actionButton!.click();

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(warningBoxElement!.classList.contains('hidden')).toBe(true);
  });
});
