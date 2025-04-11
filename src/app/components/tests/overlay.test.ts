import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { Overlay } from '../overlay';

describe('Overlay', () => {
  let overlay: Overlay;
  let parentElement: HTMLElement;
  
  beforeEach(() => {
    // Setup DOM environment for tests
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    
    // Create a new overlay for each test
    overlay = new Overlay();
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
  
  describe('initialization', () => {
    it('should create an overlay with the correct properties', () => {
      expect(overlay).toBeDefined();
      
      // Add to parent to check if DOM elements are created correctly
      overlay.addTo(parentElement);
      
      // Verify the overlay was added to the DOM
      const overlayElement = parentElement.querySelector('#overlay');
      expect(overlayElement).not.toBeNull();
      
      // Verify the overlay has the correct classes
      expect(overlayElement?.className).toContain('fixed');
      expect(overlayElement?.className).toContain('top-0');
      expect(overlayElement?.className).toContain('start-0');
      expect(overlayElement?.className).toContain('bottom-0');
      expect(overlayElement?.className).toContain('end-0');
      expect(overlayElement?.className).toContain('bg-black/50');
      expect(overlayElement?.className).toContain('hidden');
    });
    
    it('should initially be hidden', () => {
      overlay.addTo(parentElement);
      
      // Verify the overlay is hidden initially
      const overlayElement = parentElement.querySelector('#overlay');
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('show', () => {
    it('should make the overlay visible', () => {
      overlay.addTo(parentElement);
      
      // Initially hidden
      const overlayElement = parentElement.querySelector('#overlay');
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      
      // Show the overlay
      overlay.show();
      
      // Should now be visible
      expect(overlayElement?.classList.contains('hidden')).toBe(false);
      expect(overlay.opened).toBe(true);
    });
  });
  
  describe('hide', () => {
    it('should hide the overlay', () => {
      overlay.addTo(parentElement);
      
      // Make it visible first
      overlay.show();
      const overlayElement = parentElement.querySelector('#overlay');
      expect(overlayElement?.classList.contains('hidden')).toBe(false);
      
      // Hide the overlay
      overlay.hide();
      
      // Should now be hidden
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('toggle', () => {
    it('should toggle the visibility of the overlay', () => {
      overlay.addTo(parentElement);
      const overlayElement = parentElement.querySelector('#overlay');
      
      // Initially hidden
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
      
      // Toggle to show
      overlay.toggle();
      expect(overlayElement?.classList.contains('hidden')).toBe(false);
      expect(overlay.opened).toBe(true);
      
      // Toggle to hide
      overlay.toggle();
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('opened', () => {
    it('should return true when the overlay is visible', () => {
      overlay.addTo(parentElement);
      
      // Initially hidden
      expect(overlay.opened).toBe(false);
      
      // Show the overlay
      overlay.show();
      
      // Should report as opened
      expect(overlay.opened).toBe(true);
    });
    
    it('should return false when the overlay is hidden', () => {
      overlay.addTo(parentElement);
      
      // Show then hide
      overlay.show();
      overlay.hide();
      
      // Should report as not opened
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('addEventListener', () => {
    it('should attach event listeners to the overlay element', () => {
      overlay.addTo(parentElement);
      
      // Create a mock callback
      const mockCallback = vi.fn();
      
      // Add a click event listener
      overlay.addEventListener('click', mockCallback);
      
      // Simulate a click on the overlay
      const overlayElement = parentElement.querySelector('#overlay');
      overlayElement?.dispatchEvent(new MouseEvent('click'));
      
      // Verify the callback was called
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });
}); 