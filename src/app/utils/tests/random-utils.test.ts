import { expect, describe, it } from 'vitest';

import { randomBetween, randomSign, getRandom3DPosition, getRandomValueFrom } from '../random-utils';

describe('randomBetween', () => {
  it('should return a number between min and max', () => {
    const min = 0;
    const max = 10;
    for (let i = 0; i < 100; i++) {
      const result = randomBetween(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    }
  });
});

describe('randomSign', () => {
  it('should return either 1 or -1', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomSign();
      expect([1, -1]).toContain(result);
    }
  });
});

describe('getRandom3DPosition', () => {
  it('should return an object with x, y, z coordinates', () => {
    const position = getRandom3DPosition();
    expect(position).toHaveProperty('x');
    expect(position).toHaveProperty('y');
    expect(position).toHaveProperty('z');
  });

  it('should return x and z between -1.5 and 1.5, and y equal to 3', () => {
    for (let i = 0; i < 100; i++) {
      const position = getRandom3DPosition();
      expect(position.x).toBeGreaterThanOrEqual(-1.5);
      expect(position.x).toBeLessThanOrEqual(1.5);
      expect(position.z).toBeGreaterThanOrEqual(-1.5);
      expect(position.z).toBeLessThanOrEqual(1.5);
      expect(position.y).toBe(3);
    }
  });
});

describe('getRandomValueFrom', () => {
  it('should return a value from the provided array', () => {
    const array = [1, 2, 3, 4, 5];
    for (let i = 0; i < 100; i++) {
      const result = getRandomValueFrom(array);
      expect(array).toContain(result);
    }
  });

  it('should work with arrays of different types', () => {
    const stringArray = ['a', 'b', 'c'];
    const result = getRandomValueFrom(stringArray);
    expect(stringArray).toContain(result);

    const objectArray = [{ id: 1 }, { id: 2 }];
    const objectResult = getRandomValueFrom(objectArray);
    expect(objectArray).toContain(objectResult);
  });
}); 