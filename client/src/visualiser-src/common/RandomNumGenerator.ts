// generates a random list of unique numbers
// min and max represent the range of total nodes to be be created
export const generateNumbers = (): number[] => {
  const result: number[] = [];
  const set = new Set<number>();
  const min = 8;
  const max = 12;
  const totalNodes = Math.floor(Math.random() * (max - min + 1) + min);
  for (let i = 0; i < totalNodes; i += 1) {
    const num = Math.ceil(Math.random() * 99);
    set.add(num);
  }
  set.forEach((num: number) => result.push(num));
  return result;
};
