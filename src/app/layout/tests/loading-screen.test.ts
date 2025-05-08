import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { LoadingData } from '../../services/assets-loader';
import { LoadingScreen } from '../loading-screen';

function getLoadingScreenContainer(): HTMLElement {
  return document.querySelector('#loading-screen-container') as HTMLElement;
}

function getLoadingScreenProgressBar(): HTMLElement {
  return document.querySelector('#loading-screen-progress-bar') as HTMLElement;
}

function getLoadingScreenLabelText(): HTMLElement {
  return document.querySelector('#loading-screen-label-text') as HTMLElement;
}

describe('LoadingScreen', () => {
  let loadingScreen: LoadingScreen;
  let parent: HTMLDivElement;
  
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    // Setup
    loadingScreen = new LoadingScreen();
    parent = document.createElement('div');
    document.body.appendChild(parent);
    loadingScreen.addTo(parent);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should create and initialize the loading screen correctly', () => {
    const container = document.querySelector('#loading-screen-container');
    expect(container).not.toBeNull();
    expect(container!.classList.contains('hidden')).toBe(true);
    
    const progress = document.querySelector('#loading-screen-progress-bar');
    expect(progress).not.toBeNull();
        
    const label = document.querySelector('#loading-screen-label-text');
    expect(label).not.toBeNull();
  });
    
  it('should show the loading screen', async () => {
    // Show loading screen
    await loadingScreen.show();
    
    // Verify it's visible
    const container = getLoadingScreenContainer();
    expect(container!.classList.contains('hidden')).toBe(false);
    expect(container!.style.opacity).toBe('1');
    
    // Verify progress is reset
    const label = getLoadingScreenLabelText();
    expect(label.innerHTML).toBe('0%');
    
    const progress = getLoadingScreenProgressBar();
    expect(progress.style.width).toBe('0%');
  });
  
  it('should update the loading progress', async () => {
    // Create loading data
    const loadingData: LoadingData = {
      url: 'test.jpg',
      itemsLoaded: 50,
      itemsTotal: 100
    };
    
    // Update loading screen
    await loadingScreen.update(loadingData);
    
    // Verify progress is updated
    const label = getLoadingScreenLabelText();
    expect(label.innerHTML).toBe('50%');
    
    const progress = getLoadingScreenProgressBar();
    expect(progress.style.width).toBe('50%');
  });
  
  it('should hide the loading screen', async () => {
    // Hide loading screen
    await loadingScreen.hide();
    
    // Verify opacity is set to 0
    const container = getLoadingScreenContainer();
    expect(container!.style.opacity).toBe('0');
    
    // Verify it's hidden
    expect(container!.classList.contains('hidden')).toBe(true);
  });
});
