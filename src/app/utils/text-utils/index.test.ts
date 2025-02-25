import { expect, describe, it } from 'vitest';
import { getPathArray } from '.';

describe('getPathArray', () => {
  it('should work with path literals', () => {
    const path = 'position.y';
    const result = getPathArray(path);
    expect(result).toEqual(['position', 'y']);
  });

  it.concurrent('should work with regex paths', () => {
    const path = '/.*/.color';
    const result = getPathArray(path);
    expect(result).toEqual(['/.*/', 'color']);
  });
});