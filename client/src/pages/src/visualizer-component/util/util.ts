export function assertUnreachable(x: never, shouldThrow: boolean = true) {
  if (shouldThrow) {
    throw new Error(`Didn't expect to get here. Object is: ${JSON.stringify(x)}`);
  }
}

export function cloneSimple<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function recursiveUpdate(target: Object, source: Object) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        source[key] !== null &&
        // eslint-disable-next-line no-prototype-builtins
        target.hasOwnProperty(key) &&
        typeof target[key] === 'object'
      ) {
        // If the current property is an object and not an array, and the target has the same property, then recurse
        recursiveUpdate(target[key], source[key]);
      } else {
        // Otherwise, simply assign the new value to the target
        target[key] = source[key];
      }
    }
  }
}
