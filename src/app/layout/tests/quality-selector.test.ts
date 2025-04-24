import { describe, it, expect, beforeEach, vi } from 'vitest';

import { QualitySelector, Quality, qualityFromString } from '../quality-selector';

describe('QualitySelector', () => {
  let qualitySelector: QualitySelector;
  let parent: HTMLDivElement;
  
  beforeEach(() => {
    // Setup
    qualitySelector = new QualitySelector(Quality.High);
    parent = document.createElement('div');
    document.body.appendChild(parent);
    qualitySelector.addTo(parent);
  });
  
  it('should create and initialize the quality selector correctly', () => {
    // Access the private field for testing
    const selectorElement = parent.querySelector('#quality-selector');
    expect(selectorElement).not.toBeNull();

    // Check if the select element was created
    const selectElement = selectorElement!.querySelector('#quality-selector-select');
    expect(selectElement).not.toBeNull();
    
    // Check if options were created
    const options = selectElement!.querySelectorAll('option');
    expect(options.length).toBe(2);
    expect(options[0].value).toBe(Quality.High);
    expect(options[1].value).toBe(Quality.Low);
    
    // Check if the default quality is set
    expect(options[0].selected).toBe(true);
    expect(options[1].selected).toBe(false);
  });
  
  it('should dispatch an event when quality changes', () => {
    // Setup event listener
    const mockListener = vi.fn();
    qualitySelector.addEventListener('quality-changed', mockListener);
    
    // Create a change event
    const changeEvent = new CustomEvent('change', { detail: Quality.Low });
    const selectElement = parent.querySelector('#quality-selector-select')! as HTMLSelectElement;
    Object.defineProperty(changeEvent, 'target', { value: selectElement });
    
    // Set a new selected value
    selectElement.value = Quality.Low;
    
    // Trigger change event
    qualitySelector.onQualityChange(changeEvent);
    
    // Verify event was dispatched with correct data
    expect(mockListener).toHaveBeenCalled();
    expect(mockListener.mock.calls[0][0].detail).toBe(Quality.Low);
  });
});

describe('qualityFromString', () => {
  it('should return Quality.High when "high" is provided', () => {
    expect(qualityFromString('high')).toBe(Quality.High);
  });
  
  it('should return Quality.Low when "low" is provided', () => {
    expect(qualityFromString('low')).toBe(Quality.Low);
  });
  
  it('should return Quality.Low when null is provided', () => {
    expect(qualityFromString(null)).toBe(Quality.Low);
  });
  
  it('should return Quality.Low for any other string', () => {
    expect(qualityFromString('invalid')).toBe(Quality.Low);
  });
});
