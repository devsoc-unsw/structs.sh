// generates a random list of unique numbers
// min and max represent the range of total nodes to be be created
export const generateNumbers = () => {
  const result = [];
  const set = new Set();
  const min = 8;
  const max = 12;
  const totalNodes = Math.floor(Math.random() * (max - min + 1) + min);
  for (let i = 0; i < totalNodes; i += 1) {
    const num = Math.ceil(Math.random() * 99);
    set.add(num);
  }
  set.forEach((num) => result.push(num));
  return result;
};

// generates a random list of sorting numbers
// min and max represent the range of total nodes to be be created
export const generateSortingNumbers = () => {
  const result = [];
  const min = 8;
  const max = 12;
  const totalNodes = Math.floor(Math.random() * (max - min + 1) + min);
  // Choose an index between 0 and 2 to be selected for duplication
  const dupeIndex = Math.floor(Math.random() * 3);
  // Choose either 3 or 4 numbers to be duplicated
  const dupeCount = Math.floor(Math.random() * 2) + 3;
  // Storing all the indices that will have duplicated values in result array
  const dupedIndices = [];
  for (let i = 0; i < dupeCount; i++) {
    const randomNumber = Math.floor(Math.random() * (totalNodes - dupeIndex + 1) + dupeIndex);
    // If the random index was already generated or is equivalent to the ranges, regenerate
    if (
      dupedIndices.includes(randomNumber) ||
      randomNumber === totalNodes ||
      randomNumber === dupeIndex
    ) {
      i--;
    } else {
      dupedIndices.push(randomNumber);
    }
  }
  console.log(totalNodes);
  console.log(dupeIndex);
  console.log(dupedIndices);
  for (let i = 0; i < totalNodes; i += 1) {
    // 10% chance to randomly choose a number to be duplicated
    const rng = Math.random();
    if (dupedIndices.includes(result.length)) {
      result.push(result[dupeIndex]);
    } else if (rng < 0.9 || result.length === 0) {
      const num = Math.ceil(Math.random() * 99);
      result.push(num);
    } else {
      let randomIndex = dupeIndex;
      while (result[randomIndex] === result[dupeIndex]) {
        randomIndex = Math.floor(Math.random() * result.length);
        // Break loop if only value in array is the duplicated value
        if (result.every((val) => val === result[dupeIndex])) break;
      }
      result.push(result[randomIndex]);
    }
  }
  return result;
};
