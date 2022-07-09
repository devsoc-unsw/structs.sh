// generates a random list of unique numbers
// min and max represent the range of total nodes to be be created
export const generateNumbers = () =>{
  const result = [];
  const set = new Set();
  const min = 4;
  const max = 9;
  const totalNodes = Math.floor(Math.random() * (max - min + 1) + min);
  for (let i = 0; i < totalNodes; i += 1) {
    const num = Math.ceil(Math.random() * 10);
    set.add(num);
  }
  set.forEach(num => result.push(num));
  return result;
}


