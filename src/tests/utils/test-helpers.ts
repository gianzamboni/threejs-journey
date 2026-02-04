import { vi } from 'vitest';

/**
 * Test helper for mounting UI components to a temporary DOM element.
 * Automatically handles cleanup between tests.
 * 
 * Usage:
 * ```typescript
 * let container: ComponentTestContainer<InfoBox>;
 * 
 * beforeEach(() => {
 *   container = mountComponent(() => new InfoBox());
 * });
 * 
 * afterEach(() => {
 *   container.cleanup();
 * });
 * ```
 */
export interface ComponentTestContainer<T> {
  component: T;
  parent: HTMLDivElement;
  cleanup: () => void;
}

/**
 * Mounts a component to a temporary DOM element for testing.
 * @param factory Function that creates and returns the component instance
 * @param options Optional configuration
 * @returns Container with component, parent element, and cleanup function
 */
export function mountComponent<T extends { addTo(parent: HTMLElement): void }>(
  factory: () => T,
  options: { clearBody?: boolean; clearMocks?: boolean } = {}
): ComponentTestContainer<T> {
  const { clearBody = true, clearMocks = true } = options;

  if (clearMocks) {
    vi.clearAllMocks();
  }

  if (clearBody) {
    document.body.innerHTML = '';
  }

  const component = factory();
  const parent = document.createElement('div');
  document.body.appendChild(parent);
  component.addTo(parent);

  return {
    component,
    parent,
    cleanup: () => {
      document.body.innerHTML = '';
    }
  };
}

import type { Exercise } from '../../app/types/exercise';

/**
 * Creates a mock exercise object for testing.
 * @param overrides Optional properties to override defaults
 * @returns Mock exercise object
 */
export function createMockExercise(overrides: Record<string, unknown> = {}): Exercise {
  return {
    scene: {},
    camera: {},
    updateCamera: vi.fn(),
    ...overrides
  } as unknown as Exercise;
}
