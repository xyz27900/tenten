export const promiseTimeout = (callback: () => any, ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, ms);
  });
};
