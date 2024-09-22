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
    // Produce random number in range [dupeIndex + 1, totalNodes - 1] inclusive
    const randomNumber = dupeIndex + 1 + Math.floor(Math.random() * (totalNodes - dupeIndex - 1));
    // If the random index was already generated, regenerate
    if (dupedIndices.includes(randomNumber)) {
      i--;
    } else {
      dupedIndices.push(randomNumber);
    }
  }
  for (let i = 0; i < totalNodes; i += 1) {
    // 90% of the time we generate a new value.
    // 10% chance to randomly choose some existing value in the array to be
    // duplicated, that is not the value that is already chosen to be
    // duplicated 3-4 times.
    const willGenerateNewVal = Math.random() < 0.9;

    if (dupedIndices.includes(result.length)) {
      result.push(result[dupeIndex]);
    } else if (result.length === 0 || willGenerateNewVal) {
      const num = Math.ceil(Math.random() * 99);
      result.push(num);
    } else {
      // Duplicate a random value from the array, that is not the value
      // that is already chosen to be duplicated 3-4 times.
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
