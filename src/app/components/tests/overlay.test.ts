import { expect, describe, it, beforeEach, vi } from 'vitest';

import { Overlay } from '../overlay';

describe('Overlay', () => {
  let overlay: Overlay;
  const parentElement = document.body;
  
  beforeEach(() => {
    document.body.innerHTML = '';
    overlay = new Overlay();
    overlay.addTo(parentElement);
  });
  
  describe('initialization', () => {
    it('should create an overlay with the correct properties', () => {
      expect(overlay).toBeDefined();
      
      const overlayElement = parentElement.querySelector('#overlay');
      expect(overlayElement).not.toBeNull();
    });
    
    it('should initially be hidden', () => {
      const overlayElement = parentElement.querySelector('#overlay') as HTMLElement;
      expect(overlayElement.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('show', () => {
    it('should make the overlay visible', () => {
      const overlayElement = parentElement.querySelector('#overlay') as HTMLElement;
      expect(overlayElement.classList.contains('hidden')).toBe(true);
      
      overlay.show();
      
      expect(overlayElement.classList.contains('hidden')).toBe(false);
      expect(overlay.opened).toBe(true);
    });
  });
  
  describe('hide', () => {
    it('should hide the overlay', () => {
      overlay.show();
      const overlayElement = parentElement.querySelector('#overlay') as HTMLElement;
      expect(overlayElement.classList.contains('hidden')).toBe(false);
      
      overlay.hide();
      
      expect(overlayElement.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('toggle', () => {
    it('should toggle the visibility of the overlay', () => {
      const overlayElement = parentElement.querySelector('#overlay');
      
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
      
      overlay.toggle();
      expect(overlayElement?.classList.contains('hidden')).toBe(false);
      expect(overlay.opened).toBe(true);
      
      overlay.toggle();
      expect(overlayElement?.classList.contains('hidden')).toBe(true);
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('opened', () => {
    it('should return true when the overlay is visible', () => {
      expect(overlay.opened).toBe(false);
      
      overlay.show();
      
      expect(overlay.opened).toBe(true);
    });
    
    it('should return false when the overlay is hidden', () => {
      overlay.show();
      overlay.hide();
      
      expect(overlay.opened).toBe(false);
    });
  });
  
  describe('addEventListener', () => {
    it('should attach event listeners to the overlay element', () => {
      const mockCallback = vi.fn();
      
      overlay.addEventListener('click', mockCallback);
      
      const overlayElement = parentElement.querySelector('#overlay') as HTMLElement;
      overlayElement.dispatchEvent(new MouseEvent('click'));
      
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });
}); 