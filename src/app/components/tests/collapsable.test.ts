import { expect, describe, it, beforeEach } from 'vitest';

import { sleep } from '#/app/utils/sleep';

import { Collapsable } from '../collapsable';

function getCollapsableContainer(id: string): HTMLElement {
  return document.querySelector(`#collapsable-${id}`) as HTMLElement;
}

function getCollapsableButton(id: string): HTMLButtonElement {
  return getCollapsableContainer(id).querySelector(`#collapsable-${id}-toggle-button`) as HTMLButtonElement;
}

function getCollapsableContent(id: string): HTMLElement {
  return getCollapsableContainer(id).querySelector(`#collapsable-${id}-content-container`) as HTMLElement;
}

function getTitle(id: string): HTMLElement {
  return getCollapsableButton(id).querySelector(`#collapsable-${id}-title`) as HTMLElement;
}


describe('Collapsable', () => {
  const parentElement = document.body;
  const id = 'test-id';
  const title = 'Test Title';

  beforeEach(() => {
    parentElement.innerHTML = '';
  });
  
  describe('addTo', () => {

    it('should add itself to a parent element', () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);
      
      expect(parentElement.children.length).toBe(1);
      
      const container = parentElement.firstElementChild;
      expect(container).not.toBeNull();
      expect(container!.id).toBe('collapsable-test-id');
      
      const contentElement = container!.querySelector('#collapsable-test-id-content-container');
      expect(contentElement).not.toBeNull();

      const buttonElement = container!.querySelector('#collapsable-test-id-toggle-button');
      expect(buttonElement).not.toBeNull();


      const titleElement = container!.querySelector('#collapsable-test-id-title');
      expect(titleElement).not.toBeNull();
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
      
      const customCollapsable = new Collapsable(id, title, customSettings);
      customCollapsable.addTo(parentElement);
      
      const container = getCollapsableContainer(id);
      expect(container.className).toContain('custom-container-class');

      const button = getCollapsableButton(id);
      expect(button.className).toContain('custom-button-class');
      
      const collapsableElement = getCollapsableContent(id);
      expect(collapsableElement.className).toContain('custom-collapsable-class');
    });
    
    it('should display the correct title', () => {
      const customCollapsable = new Collapsable(id, title);
      customCollapsable.addTo(parentElement);

      const titleElement = getTitle(id);
      expect(titleElement.textContent).toBe(title);
    });
    
    it('should have no content initially', () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);

      const contentElement = getCollapsableContent(id);
      expect(contentElement.children.length).toBe(0);
      
      // Initially, the button is not disabled as it's set to active by default
      const buttonElement = getCollapsableButton(id);
      expect(buttonElement).not.toBeNull();
      expect(buttonElement.disabled).toBe(false);
      
      // Button icon should be hidden initially
      const iconElement = buttonElement.querySelector('svg');
      expect(iconElement).not.toBeNull();
      expect(iconElement?.classList.contains('hidden')).toBe(true);
    });
  });
  
  describe('updateTitle', () => {
    it('should update the title', () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);

      const titleElement = getTitle(id);
      expect(titleElement.textContent).toBe(title);

      const newTitle = 'Updated Title';
      collapsable.updateTitle(newTitle);
      
      expect(titleElement.textContent).toBe(newTitle);
    });
  });
  
  describe('addContent', () => {
    it('should add content to the collapsable section', () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);
      
      const buttonElement = getCollapsableButton(id);
      const iconElement = buttonElement.querySelector('svg') as SVGElement;
      expect(iconElement.classList.contains('hidden')).toBe(true);
      
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      collapsable.addContent(content);
      
      expect(iconElement.classList.contains('hidden')).toBe(false);
      
      const containerElement = getCollapsableContent(id);
      expect(containerElement.contains(content)).toBe(true);
      expect(containerElement.textContent).toContain('Test Content');
      
      expect(buttonElement.disabled).toBe(false);
    });
  });
  
  describe('replaceContent', () => {
      it('should replace content in the collapsable section', () => {
        const collapsable = new Collapsable(id, title);
        collapsable.addTo(parentElement);
        
        const initialContent = document.createElement('div');
        initialContent.textContent = 'Initial Content';
        initialContent.id = 'initial';
        collapsable.addContent(initialContent);
        
        const newContent1 = document.createElement('div');
        newContent1.textContent = 'New Content 1';
        newContent1.id = 'new1';
        
        const newContent2 = document.createElement('div');
        newContent2.textContent = 'New Content 2';
        newContent2.id = 'new2';
        
        collapsable.replaceContent([newContent1, newContent2]);
        
        const containerElement = getCollapsableContent(id);

        expect(containerElement.children.length).toBe(2);          
        expect(containerElement.querySelector('#initial')).toBeNull();
        
        expect(containerElement.querySelector('#new1')).not.toBeNull();
        expect(containerElement?.querySelector('#new2')).not.toBeNull();
        expect(containerElement?.textContent).toContain('New Content 1');
        expect(containerElement?.textContent).toContain('New Content 2');
    });
    
    it('should disable controls when content is empty', () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);
      
      const content = document.createElement('div');
      collapsable.addContent(content);
      
      const button = getCollapsableButton(id);
      const icon = button.querySelector('svg');
      
      expect(button).not.toBeNull();
      expect(button.disabled).toBe(false);
      expect(icon?.classList.contains('hidden')).toBe(false);
      
      collapsable.replaceContent([]);
      
      expect(button.disabled).toBe(true);
      expect(icon?.classList.contains('hidden')).toBe(true);
      expect(getCollapsableContent(id).children.length).toBe(0);
    });
  });
  
  describe('toggle', () => {
    it('should toggle the collapsable section visibility', async () => {
      const collapsable = new Collapsable(id, title);
      collapsable.addTo(parentElement);
      
      const content = document.createElement('div');
      content.textContent = 'Toggle Content';
      collapsable.addContent(content);
      
      const contentContainer = getCollapsableContent(id);
      expect(contentContainer.classList.contains('hidden')).toBe(true);
      
      collapsable.toggle();
      await sleep(500);

      expect(contentContainer.classList.contains('hidden')).toBe(false);
      
      collapsable.toggle();
      await sleep(500);

      expect((contentContainer as HTMLElement).style.height).toBe('0px');
      
    });
    
    it('should support custom toggle button settings', async () => {
      const customSettings = {
        button: {
          toggle: ['active-button', 'highlighted']
        }
      };
      
      const customCollapsable = new Collapsable(id, title, customSettings);
      customCollapsable.addTo(parentElement);
      
      const content = document.createElement('div');
      customCollapsable.addContent(content);
      
      const button = getCollapsableButton(id);
      expect(button?.classList.contains('active-button')).toBe(false);
      expect(button?.classList.contains('highlighted')).toBe(false);

      customCollapsable.toggle();
      await sleep(500);

      expect(button?.classList.contains('active-button')).toBe(true);
      expect(button?.classList.contains('highlighted')).toBe(true);
      
      customCollapsable.toggle();
      await sleep(500);
      
      expect(button?.classList.contains('active-button')).toBe(false);
      expect(button?.classList.contains('highlighted')).toBe(false);
    });
  });
});


