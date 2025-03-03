export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function waitForCondition(condition: () => boolean) {
  const helper = (resolve: (_: unknown) => void) => {
    if(condition()) {
      resolve(undefined);
    } else {
      setTimeout(() => helper(resolve), 500);
    }
  }

  return new Promise(resolve => {
    helper(resolve);
  });
}