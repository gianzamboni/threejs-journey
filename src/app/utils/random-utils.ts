/**
 * Returns a random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Returns either 1 or -1 randomly
 */
export function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1;
} 


export function getRandom3DPosition() {
  return {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  }
}

export function getRandomValueFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
};