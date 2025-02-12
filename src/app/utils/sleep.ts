export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function waitForCondition(condition: () => boolean) {
  const helper = (resolve: Function) => {
    if(condition()) {
      resolve();
    } else {
      setTimeout(() => helper(resolve), 500);
    }
  }

  return new Promise(resolve => {
    helper(resolve);
  });
}