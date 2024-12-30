export function nearestPowerOfTwo(x) {
  x = x | (x >> 1);
  x = x | (x >> 2);
  x = x | (x >> 4);
  x = x | (x >> 8);
  x = x | (x >> 16);
  x = x | (x >> 32);
  return x - (x >> 1);;
}

export function screenResolution() {
  return {
    width: window.screen.width * window.devicePixelRatio,
    height: window.screen.height * window.devicePixelRatio,
  };
}

export function screenResolutionName() {
  const { width, height } = screenResolution();
  console.log(width, height);
  if(width >= 3840 && height >= 2160) {
    return '4k';
  } else if(width >= 2560 && height >= 1440) {
    return '2k';
  } else {
    return '1k';
  }
}