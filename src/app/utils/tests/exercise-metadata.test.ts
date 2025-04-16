import { expect, describe, it, beforeEach } from 'vitest';

import { ExerciseControllers } from '#/app/decorators/customizable';
import { Exercise, Action } from '#/app/types/exercise';

import {
  getMetadata,
  getId,
  getDescriptions,
  isDebuggable,
  isAnimated,
  getControllers,
  hasControllers,
  getActions,
  MetadataTarget
} from '../exercise-metadata';

describe('exercise-metadata', () => {
  let mockTarget: MetadataTarget;

  beforeEach(() => {
    mockTarget = {
      [Symbol.metadata]: {
        id: 'test-exercise',
        descriptions: ['Test description'],
        isDebuggable: true,
        isAnimated: true,
        controllersConfig: {
          testController: { min: 0, max: 1 }
        } as unknown as ExerciseControllers,
        actions: [{ name: 'test', handler: () => {} } as unknown as Action],
        orbitControllerDescription: true
      }
    } as unknown as Exercise;
  });

  describe('getMetadata', () => {
    it('should return metadata from target', () => {
      const metadata = getMetadata(mockTarget);
      expect(metadata.id).toBe('test-exercise');
    });

    it('should return metadata from constructor if target metadata is null', () => {
      const target = {
        constructor: {
          [Symbol.metadata]: { id: 'constructor-test' }
        }
      } as unknown as MetadataTarget;
      
      const metadata = getMetadata(target);
      expect(metadata.id).toBe('constructor-test');
    });

    it('should return empty object if no metadata exists', () => {
      const target = {} as unknown as MetadataTarget;
      const metadata = getMetadata(target);
      expect(metadata).toEqual({});
    });
  });

  describe('getId', () => {
    it('should return id from metadata', () => {
      const id = getId(mockTarget);
      expect(id).toBe('test-exercise');
    });

    it('should throw error if id is undefined', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      expect(() => getId(target)).toThrow('Exercise id is undefined');
    });
  });

  describe('getDescriptions', () => {
    it('should return descriptions from metadata', () => {
      const descriptions = getDescriptions(mockTarget);
      expect(descriptions).toContain('Test description');
    });

    it('should include orbit controller description if enabled', () => {
      const descriptions = getDescriptions(mockTarget);
      expect(descriptions[1]).toContain('Rotate:');
      expect(descriptions[1]).toContain('Zoom:');
      expect(descriptions[1]).toContain('Pan:');
    });

    it('should include debug controller description if debuggable', () => {
      const descriptions = getDescriptions(mockTarget);
      expect(descriptions[1]).toContain('Toggle Debug');
    });

    it('should return empty array if no descriptions', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      const descriptions = getDescriptions(target);
      expect(descriptions).toEqual([]);
    });
  });

  describe('isDebuggable', () => {
    it('should return true if target is debuggable', () => {
      expect(isDebuggable(mockTarget)).toBe(true);
    });

    it('should return false if target is not debuggable', () => {
      const target = {
        [Symbol.metadata]: { isDebuggable: false }
      } as unknown as MetadataTarget;
      
      expect(isDebuggable(target)).toBe(false);
    });

    it('should return false if debuggable is not specified', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      expect(isDebuggable(target)).toBe(false);
    });
  });

  describe('isAnimated', () => {
    it('should return true if target is animated', () => {
      expect(isAnimated(mockTarget)).toBe(true);
    });

    it('should return false if target is not animated', () => {
      const target = {
        [Symbol.metadata]: { isAnimated: false }
      } as unknown as MetadataTarget;
      
      expect(isAnimated(target)).toBe(false);
    });

    it('should return false if animated is not specified', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      expect(isAnimated(target)).toBe(false);
    });
  });

  describe('getControllers', () => {
    it('should return controllers config from metadata', () => {
      const controllers = getControllers(mockTarget);
      expect(controllers).toEqual({
        testController: { min: 0, max: 1 }
      });
    });

    it('should return empty object if no controllers config', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      const controllers = getControllers(target);
      expect(controllers).toEqual({});
    });
  });

  describe('hasControllers', () => {
    it('should return true if target has controllers', () => {
      expect(hasControllers(mockTarget)).toBe(true);
    });

    it('should return false if target has no controllers', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      expect(hasControllers(target)).toBe(false);
    });
  });

  describe('getActions', () => {
    it('should return actions from metadata', () => {
      const actions = getActions(mockTarget);
      expect(actions).toHaveLength(1);
      expect((actions[0] as Action & { name: string }).name).toBe('test');
    });

    it('should return empty array if no actions', () => {
      const target = {
        [Symbol.metadata]: {}
      } as unknown as MetadataTarget;
      
      const actions = getActions(target);
      expect(actions).toEqual([]);
    });
  });
}); 