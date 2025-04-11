import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import { sleep } from '#/app/utils/sleep';

import { Collapsable } from '../collapsable';

describe('Collapsable', () => {
  let collapsable: Collapsable;
  let parentElement: HTMLElement;
  
  beforeEach(() => {
    // Setup DOM environment for tests
    parentElement = document.createElement('div');
    document.body.appendChild(parentElement);
    
    // Create a new collapsable for each test
    collapsable = new Collapsable('id', 'Test Title', {});
  });
  
  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
  
  describe('addTo', () => {
    it('should add itself to a parent element', () => {
      // Call the public method to add to a parent
      collapsable.addTo(parentElement);
      
      // Verify that a child was added to the parent
      expect(parentElement.children.length).toBe(1);
      
      // The container should be a div with a collapsable title
      const container = parentElement.firstElementChild;
      expect(container).toBeDefined();
      expect(container?.tagName).toBe('DIV');
      expect(container?.id).toBe('collapsable-id');
    });
    
    it('should apply custom class names', () => {
      const customSettings = {
        className: 'custom-container-class',
        button: {
          className: 'custom-button-class',
        },
        collapsable: {
          className: 'custom-collapsable-class'
        }
      };
      
      const customCollapsable = new Collapsable('custom', 'Custom', customSettings);
      customCollapsable.addTo(parentElement);
      
      // Check if custom classes were applied
      const container = parentElement.firstElementChild;
      expect(container?.className).toContain('custom-container-class');
      
      const button = container?.querySelector('button');
      expect(button?.className).toContain('custom-button-class');
      
      // Find collapsable element
      const collapsableElement = container?.querySelector('#collapsable-custom-content-container');
      expect(collapsableElement?.className).toContain('custom-collapsable-class');
    });
    
    it('should display the correct title', () => {
      const title = 'Custom Title';
      const customCollapsable = new Collapsable('custom', title, {});
      customCollapsable.addTo(parentElement);
      
      // Check if title is displayed
      const titleElement = parentElement.querySelector('.collapsable-custom-title');
      expect(titleElement).not.toBeNull();
      expect(titleElement?.textContent).toBe(title);
    });
    
    it('should have no content initially', () => {
      collapsable.addTo(parentElement);
      const container = parentElement.querySelector('#collapsable-id-content-container');
      expect(container?.children.length).toBe(0);
      
      // Initially, the button is not disabled as it's set to active by default
      const button = parentElement.querySelector('button');
      expect(button).not.toBeNull();
      expect(button?.disabled).toBe(false);
      
      // Button icon should be hidden initially
      const icon = button?.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon?.classList.contains('hidden')).toBe(true);
    });
  });
  
  describe('updateTitle', () => {
    it('should update the title', () => {
      collapsable.addTo(parentElement);
      const newTitle = 'Updated Title';
      
      // Find the original title
      const titleElement = parentElement.querySelector('.collapsable-id-title');
      expect(titleElement?.textContent).toBe('Test Title');
      
      // Update the title
      collapsable.updateTitle(newTitle);
      
      // Check if title was updated
      expect(titleElement?.textContent).toBe(newTitle);
    });
  });
  
  describe('addContent', () => {
    it('should add content to the collapsable section', () => {
      collapsable.addTo(parentElement);
      
      // Initially, the button icon should be hidden
      const button = parentElement.querySelector('button');
      const icon = button?.querySelector('svg');
      expect(icon?.classList.contains('hidden')).toBe(true);
      
      // Create content and add it
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      collapsable.addContent(content);
      
      // The button icon should now be visible (hidden class removed)
      expect(icon?.classList.contains('hidden')).toBe(false);
      
      // Check if the content is in the DOM
      const containerElement = parentElement.querySelector('#collapsable-id-content-container');
      expect(containerElement?.contains(content)).toBe(true);
      expect(containerElement?.textContent).toContain('Test Content');
      
      // Button should be enabled
      expect(button?.disabled).toBe(false);
    });
  });
  
  describe('replaceContent', () => {
    it('should replace content in the collapsable section', () => {
      collapsable.addTo(parentElement);
      
      // Add initial content
      const initialContent = document.createElement('div');
      initialContent.textContent = 'Initial Content';
      initialContent.id = 'initial';
      collapsable.addContent(initialContent);
      
      // Replace content
      const newContent1 = document.createElement('div');
      newContent1.textContent = 'New Content 1';
      newContent1.id = 'new1';
      
      const newContent2 = document.createElement('div');
      newContent2.textContent = 'New Content 2';
      newContent2.id = 'new2';
      
      collapsable.replaceContent([newContent1, newContent2]);
      
      // Check the container's content
      const containerElement = parentElement.querySelector('#collapsable-id-content-container');
      
      // The initial content should be gone
      expect(containerElement?.querySelector('#initial')).toBeNull();
      
      // The new content should be there
      expect(containerElement?.querySelector('#new1')).not.toBeNull();
      expect(containerElement?.querySelector('#new2')).not.toBeNull();
      expect(containerElement?.textContent).toContain('New Content 1');
      expect(containerElement?.textContent).toContain('New Content 2');
    });
    
    it('should disable controls when content is empty', () => {
      collapsable.addTo(parentElement);
      
      // Add content first
      const content = document.createElement('div');
      collapsable.addContent(content);
      
      // Find the button and icon
      const button = parentElement.querySelector('button');
      const icon = button?.querySelector('svg');
      
      // With content, the button should be enabled and icon visible
      expect(button).not.toBeNull();
      expect(button?.disabled).toBe(false);
      expect(icon?.classList.contains('hidden')).toBe(false);
      
      // Replace with empty content
      collapsable.replaceContent([]);
      
      // Button should be disabled and icon hidden again
      expect(button?.disabled).toBe(true);
      expect(icon?.classList.contains('hidden')).toBe(true);
    });
  });
  
  describe('toggle', () => {
    it('should toggle the collapsable section visibility', async () => {
      collapsable.addTo(parentElement);
      
      // Add some content to make the section expandable
      const content = document.createElement('div');
      content.textContent = 'Toggle Content';
      collapsable.addContent(content);
      
      // Find the content container element
      const contentContainer = parentElement.querySelector('#collapsable-id-content-container');
      expect(contentContainer).not.toBeNull();
      
      // Initially the content should be hidden (has 'hidden' class)
      expect(contentContainer?.classList.contains('hidden')).toBe(true);
      
      // Toggle to open
      collapsable.toggle();
      await sleep(1000);
      // Verify content is visible (hidden class removed)
      expect(contentContainer?.classList.contains('hidden')).toBe(false);
      
      // Toggle to close
      collapsable.toggle();
      
      // Verify height is set to 0
      expect((contentContainer as HTMLElement).style.height).toBe('0px');
      
    });
    
    it('should support custom toggle button settings', () => {
      const customSettings = {
        button: {
          toggle: ['active-button', 'highlighted']
        }
      };
      
      const customCollapsable = new Collapsable('toggle-test', 'Toggle Test', customSettings);
      customCollapsable.addTo(parentElement);
      
      // Add content to make the toggle effective
      const content = document.createElement('div');
      customCollapsable.addContent(content);
      
      // Find the button
      const button = parentElement.querySelector('button');
      expect(button).not.toBeNull();
      
      // Button should not have toggle classes initially
      expect(button?.classList.contains('active-button')).toBe(false);
      expect(button?.classList.contains('highlighted')).toBe(false);
      
      // Toggle to open
      customCollapsable.toggle();
      
      // Now button should have those classes
      expect(button?.classList.contains('active-button')).toBe(true);
      expect(button?.classList.contains('highlighted')).toBe(true);
      
      // Toggle to close
      customCollapsable.toggle();
      
      // Classes should be removed
      expect(button?.classList.contains('active-button')).toBe(false);
      expect(button?.classList.contains('highlighted')).toBe(false);
    });
  });
});


