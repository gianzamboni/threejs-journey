import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import SideBar from '../sidebar';

describe('SideBar', () => {
  let sidebar: SideBar;
  let parentElement: HTMLElement;
  
  beforeEach(() => {
    // Setup DOM environment for tests
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    
    // Create a new sidebar for each test
    sidebar = new SideBar({ buttonTitle: 'Menu' });
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
  
  describe('initialization', () => {
    it('should create a sidebar with the correct properties', () => {
      expect(sidebar).toBeDefined();
      
      // Add to parent to check if DOM elements are created correctly
      sidebar.addTo(parentElement);
      
      // Verify the sidebar components were added to the DOM
      const sidePanel = parentElement.querySelector('#sidebar-panel');
      const button = parentElement.querySelector('#sidebar-toggle-button');
      const overlay = parentElement.querySelector('#overlay');
      
      expect(sidePanel).not.toBeNull();
      expect(button).not.toBeNull();
      expect(overlay).not.toBeNull();
      
      // Verify the button has the correct title
      expect(button?.innerHTML).toContain('Menu');      
    });
    
    it('should initially be hidden', () => {
      sidebar.addTo(parentElement);
      
      // Verify the sidebar is initially hidden
      const sidePanel = parentElement.querySelector('#sidebar-panel');
      const overlay = parentElement.querySelector('#overlay');
      console.log(sidePanel?.className);
      expect(sidePanel?.classList).toContain('-translate-x-full');
      expect(overlay?.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
  });
  
  describe('addTo', () => {
    it('should add the sidebar components to the specified parent element', () => {
      // Parent should initially be empty
      expect(parentElement.children.length).toBe(0);
      
      // Add sidebar to parent
      sidebar.addTo(parentElement);
      
      // Parent should now have 3 children (overlay, panel, and button)
      expect(parentElement.children.length).toBe(3);
    });
  });
  
  describe('addContent', () => {
    it('should add content to the sidebar panel', () => {
      sidebar.addTo(parentElement);
      
      // Create content and add it
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      content.id = 'test-content';
      sidebar.addContent(content);
      
      // Find the sidebar content container
      const sidebarContent = parentElement.querySelector('#sidebar-body');
      
      // Check if content was added
      expect(sidebarContent).toContain(content);
      const addedContent = sidebarContent?.querySelector('#test-content');
      expect(addedContent).not.toBeNull();
      expect(addedContent?.textContent).toBe('Test Content');
    });
  });
  
  describe('toggleSidePanel', () => {
    it('should toggle the visibility of the sidebar and overlay', () => {
      sidebar.addTo(parentElement);
      
      // Get references to elements
      const sidePanel = parentElement.querySelector('#sidebar-panel');
      const overlay = parentElement.querySelector('#overlay');
      const button = parentElement.querySelector('#sidebar-toggle-button') as HTMLButtonElement;
      
      // Initially hidden
      expect(sidePanel?.classList).toContain('-translate-x-full');
      expect(overlay?.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
      
      // Click the button to toggle sidebar
      button?.click();
      
      // Should now be visible
      expect(sidePanel?.classList).not.toContain('-translate-x-full');
      expect(overlay?.classList).not.toContain('hidden');
      expect(sidebar.opened).toBe(true);
      
      // Click again to hide
      button?.click();
      
      // Should be hidden again
      expect(sidePanel?.classList).toContain('-translate-x-full');
      expect(overlay?.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
    
    it('should close the sidebar when clicking on the overlay', () => {
      sidebar.addTo(parentElement);
      
      // Get references to elements
      const sidePanel = parentElement.querySelector(' #sidebar-panel');
      const overlay = parentElement.querySelector('#overlay');
      const button = parentElement.querySelector('#sidebar-toggle-button') as HTMLButtonElement;
      
      // Show the sidebar
      button?.click();
      
      // Verify it's visible
      expect(sidePanel?.classList).not.toContain('-translate-x-full');
      expect(overlay?.classList).not.toContain('hidden');
      expect(sidebar.opened).toBe(true);
      
      // Click on the overlay to close
      overlay?.dispatchEvent(new MouseEvent('click'));
      
      // Should be hidden again
      expect(sidePanel?.classList).toContain('-translate-x-full');
      expect(overlay?.classList).toContain('hidden');
      expect(sidebar.opened).toBe(false);
    });
  });
  
  describe('opened', () => {
    it('should return true when the sidebar is visible', () => {
      sidebar.addTo(parentElement);
      
      // Initially hidden
      expect(sidebar.opened).toBe(false);
      
      // Open the sidebar
      const button = parentElement.querySelector('button');
      button?.click();
      
      // Should report as opened
      expect(sidebar.opened).toBe(true);
    });
    
    it('should return false when the sidebar is hidden', () => {
      sidebar.addTo(parentElement);
      
      // Open then close
      const button = parentElement.querySelector('button');
      button?.click(); // Open
      button?.click(); // Close
      
      // Should report as not opened
      expect(sidebar.opened).toBe(false);
    });
  });
}); 