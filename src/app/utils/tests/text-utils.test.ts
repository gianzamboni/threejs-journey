import { expect, describe, it } from 'vitest';

import { getPathArray } from '../text-utils';

describe('getPathArray', () => {
  it('should work with path literals', () => {
    const path = 'position.y';
    const result = getPathArray(path);
    expect(result).toEqual(['position', 'y']);
  });

  it('should work with regex paths', () => {
    const path = '/.*/.color';
    const result = getPathArray(path);
    expect(result).toEqual(['/.*/', 'color']);
  });

  it('should respect the order of the path', () => {
    const path = 'position./.*/';
    const result = getPathArray(path);
    expect(result).toEqual(['position', '/.*/']);
  });
});