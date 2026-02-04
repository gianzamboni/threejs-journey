import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { LoadingScreen } from '#/app/layout/loading-screen';
import { LoadingData } from '#/app/services/assets-loader';
import { mountComponent } from '#/tests/utils/test-helpers';

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

  beforeEach(() => {
    const container = mountComponent(() => new LoadingScreen(), { clearBody: true, clearMocks: true });
    loadingScreen = container.component;
  });

  afterEach(() => {
    document.body.innerHTML = '';
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
    await loadingScreen.show();
    
    const container = getLoadingScreenContainer();
    expect(container!.classList.contains('hidden')).toBe(false);
    expect(container!.style.opacity).toBe('1');
    
    // Verify progress is reset
    const label = getLoadingScreenLabelText();
    expect(label.innerHTML).toBe('0%');
    
    const progress = getLoadingScreenProgressBar();
    expect(progress.style.transform).toBe('scaleX(0)');
  });
  
  it('should update the loading progress', async () => {
    const loadingData: LoadingData = {
      url: 'test.jpg',
      itemsLoaded: 50,
      itemsTotal: 100
    };
    
    await loadingScreen.update(loadingData);
    
    const label = getLoadingScreenLabelText();
    expect(label.innerHTML).toBe('50%');
    
    const progress = getLoadingScreenProgressBar();
    expect(progress.style.transform).toBe('scaleX(0.5)');
  });
  
  it('should hide the loading screen', async () => {
    await loadingScreen.hide();

    const container = getLoadingScreenContainer();
    expect(container!.classList.contains('hidden')).toBe(true);
  });
});
