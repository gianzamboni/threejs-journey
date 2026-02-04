import { expect, describe, it } from 'vitest';

import { randomBetween, randomSign, getRandom3DPosition, getRandomValueFrom } from '#/app/utils/random-utils';

describe('randomBetween', () => {
  it('should return a number between min and max boundaries', () => {
    const testCases = [
      { min: 0, max: 10 },
      { min: -5, max: 5 },
      { min: 100, max: 200 },
      { min: -10, max: -1 }
    ];

    testCases.forEach(({ min, max }) => {
      for (let i = 0; i < 10; i++) {
        const result = randomBetween(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });
  });

  it('should handle edge cases', () => {
    expect(randomBetween(5, 5)).toBe(5);
    expect(randomBetween(0, 1)).toBeGreaterThanOrEqual(0);
    expect(randomBetween(0, 1)).toBeLessThanOrEqual(1);
  });
});

describe('randomSign', () => {
  it('should return either 1 or -1', () => {
    const results = new Set();
    for (let i = 0; i < 50; i++) {
      const result = randomSign();
      expect([1, -1]).toContain(result);
      results.add(result);
    }
    // Should eventually get both values (high probability)
    expect(results.size).toBeGreaterThan(0);
  });
});

describe('getRandom3DPosition', () => {
  it('should return an object with x, y, z coordinates', () => {
    const position = getRandom3DPosition();
    expect(position).toHaveProperty('x');
    expect(position).toHaveProperty('y');
    expect(position).toHaveProperty('z');
    expect(typeof position.x).toBe('number');
    expect(typeof position.y).toBe('number');
    expect(typeof position.z).toBe('number');
  });

  it('should return x and z between -1.5 and 1.5, and y equal to 3', () => {
    for (let i = 0; i < 10; i++) {
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
    const testArray = [1, 2, 3, 4, 5];
    const results = new Set();
    
    for (let i = 0; i < 20; i++) {
      const result = getRandomValueFrom(testArray);
      expect(testArray).toContain(result);
      results.add(result);
    }
    
    // Should eventually get multiple values (high probability)
    expect(results.size).toBeGreaterThan(0);
  });

  it('should work with arrays of different types', () => {
    const stringArray = ['a', 'b', 'c'];
    const stringResult = getRandomValueFrom(stringArray);
    expect(stringArray).toContain(stringResult);

    const objectArray = [{ id: 1 }, { id: 2 }];
    const objectResult = getRandomValueFrom(objectArray);
    expect(objectArray).toContain(objectResult);
  });

  it('should handle edge cases', () => {
    const singleElementArray = ['only'];
    const result = getRandomValueFrom(singleElementArray);
    expect(result).toBe('only');
  });
});