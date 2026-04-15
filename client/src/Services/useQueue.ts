import { useMemo } from 'react';

export const useQueue = () =>
  useMemo(() => {
    let queuePromise: Promise<boolean | void> = Promise.resolve();
    return (fn: () => Promise<boolean>) => {
      queuePromise = queuePromise.then(fn);
      return queuePromise;
    };
  }, []);
