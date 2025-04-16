import { expect, describe, it, beforeEach } from 'vitest';

import SideBar from '../sidebar';

function getSideBarComponents() {
  return {
    sidePanel: document.querySelector('#sidebar-panel') as HTMLElement,
    button: document.querySelector('#sidebar-toggle-button') as HTMLButtonElement,
    overlay: document.querySelector('#overlay') as HTMLElement,
    content: document.querySelector('#sidebar-body') as HTMLElement,
  }
}

describe('SideBar', () => {
  let sidebar: SideBar;
  const parentElement = document.body;
  
  beforeEach(() => {
    parentElement.innerHTML = '';
    sidebar = new SideBar({ buttonTitle: 'Test' });
    sidebar.addTo(parentElement);
  });

  describe('initialization', () => {
    it('should create a sidebar with the correct subcomponents', () => {
      expect(sidebar).toBeDefined();

      const sidePanel = parentElement.querySelector('#sidebar-panel');
      const button = parentElement.querySelector('#sidebar-toggle-button');
      const overlay = parentElement.querySelector('#overlay');
      const content = parentElement.querySelector('#sidebar-body');
      
      expect(sidePanel).not.toBeNull();
      expect(button).not.toBeNull();
      expect(overlay).not.toBeNull();
      expect(content).not.toBeNull();
    });

    it('should show the correct button title', () => {
      const { button } = getSideBarComponents();
      expect(button.innerHTML).toContain('Test');
    });
    
    it('should initially be hidden', () => {
      const { sidePanel, overlay } = getSideBarComponents();  

      expect(sidePanel.classList).toContain('-translate-x-full');
      expect(overlay.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
  });
  
  describe('addContent', () => {
    it('should add content to the sidebar panel', () => {
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      content.id = 'test-content';
      sidebar.addContent(content);
      
      const sidebarContent = parentElement.querySelector('#sidebar-body');
      expect(sidebarContent).toContain(content);
    });
  });
  
  describe('toggleSidePanel', () => {
    it('should toggle the visibility of the sidebar and overlay', () => {
      const { sidePanel, button, overlay } = getSideBarComponents();
      
      button?.click();
      
      expect(sidePanel.classList).not.toContain('-translate-x-full');
      expect(overlay.classList).not.toContain('hidden');
      expect(sidebar.opened).toBe(true);
      
      button?.click();
      
      expect(sidePanel.classList).toContain('-translate-x-full');
      expect(overlay.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
    
    it('should close the sidebar when clicking on the overlay', () => {
      const { sidePanel, button, overlay } = getSideBarComponents();
      
      button?.click();
      
      expect(sidePanel.classList).not.toContain('-translate-x-full');
      expect(overlay.classList).not.toContain('hidden');
      expect(sidebar.opened).toBe(true);
      
      overlay?.dispatchEvent(new MouseEvent('click'));
      
      expect(sidePanel.classList).toContain('-translate-x-full');
      expect(overlay.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
  });
  
  describe('opened', () => {
    it('should return true when the sidebar is visible', () => {
      const { button } = getSideBarComponents();
      
      expect(sidebar.opened).toBe(false);
      
      button?.click();
      
      expect(sidebar.opened).toBe(true);
    });
    
    it('should return false when the sidebar is hidden', () => {
      sidebar.addTo(parentElement);
      
      const { button } = getSideBarComponents();
      button?.click(); // Open
      button?.click(); // Close
      
      expect(sidebar.opened).toBe(false);
    });
  });
}); 