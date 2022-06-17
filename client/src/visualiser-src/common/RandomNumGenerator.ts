// generates a random list of unique numbers
// min and max represent the range of total nodes to be be created
export const generateNumbers = () =>{
  var result = [];
  var set = new Set();
  const min = 4;
  const max = 9;
  const totalNodes = Math.floor(Math.random() * (max - min + 1) + min);
  for (let i = 0; i < totalNodes; i++) {
    const num = Math.floor(Math.random() * 10);
    set.add(num);
  }
  set.forEach(num => result.push(num));
  return result;
}


// given a sorted array arr, inserts elements to num such that its linear insertion order
// will lead to a reasonably balanced BST
function recurseArrInsert(arr, start, end, num): void {
  // the base case is array length <=1
  if (end - start === 0) {
    return;
  } else {
    // insert midpoint
    const mid = Math.floor((end + start)/ 2);
    num.push(arr[mid]);
    // set up for recursion
    // recurse left
    recurseArrInsert(arr, start, mid, num);
    // recurse right
    recurseArrInsert(arr, mid + 1, end, num);
  }
}

export const insertBalancedBSTNumbers = () => {
  console.log("insertBalancedBSTNumbers");
  var arr = generateNumbers().sort();
  var num = [];
  recurseArrInsert(arr, 0, arr.length, num);
  console.log(num);
  return num; 
}


