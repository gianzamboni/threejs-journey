import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';

import { sleep, waitForCondition } from '../sleep';

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should wait for the specified time', async () => {
    const sleepPromise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await sleepPromise;
  });
});

describe('waitForCondition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve when condition becomes true', async () => {
    let flag = false;
    const condition = () => flag;
    
    const promise = waitForCondition(condition);
    
    // Condition is initially false
    vi.advanceTimersByTime(500);
    
    // Make condition true
    flag = true;
    vi.advanceTimersByTime(500);
    
    await promise;
  });

  it('should keep checking until condition is true', async () => {
    const mockCondition = vi.fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const promise = waitForCondition(mockCondition);
    
    vi.advanceTimersByTime(1000);
    await promise;
    
    expect(mockCondition).toHaveBeenCalledTimes(3);
  });
}); 