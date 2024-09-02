export function assertUnreachable(x: number, shouldThrow: boolean = true) {
  if (shouldThrow) {
    throw new Error(`Didn't expect to get here. Object is: ${JSON.stringify(x)}`);
  }
}

export function cloneSimple<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
