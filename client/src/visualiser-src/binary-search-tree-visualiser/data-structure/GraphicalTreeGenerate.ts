import { generateNumbers } from 'visualiser-src/common/RandomNumGenerator';
import GraphicalBSTNode from './GraphicalBSTNode';
import BSTCreateAnimationProducer from '../animation-producer/BSTCreateAnimationProducer';
import updateNodePositions from '../util/helpers';

export default class GraphicalTreeGenerate {
  // given a sorted array arr, inserts elements to num such that its linear insertion order
  // will lead to a reasonably balanced BST
  private static recurseArrInsert<T extends GraphicalBSTNode>(
    arr,
    start,
    end,
    createNode: (number) => T
  ): T {
    // the base case is array length <=1
    if (end - start === 0) {
      return null;
    }
    // insert midpoint
    const mid = Math.floor((end + start) / 2);
    const newNode = createNode(arr[mid]);
    // set up for recursion
    // recurse left
    newNode.left = GraphicalTreeGenerate.recurseArrInsert(arr, start, mid, createNode);
    // recurse right
    newNode.right = GraphicalTreeGenerate.recurseArrInsert(arr, mid + 1, end, createNode);
    return newNode;
  }

  private static create<T extends GraphicalBSTNode>(root: T): void {
    const producer = new BSTCreateAnimationProducer();
    producer.createTree(root);
  }

  public static generate<T extends GraphicalBSTNode>(createNode: (number) => T): T {
    const num = generateNumbers().sort((a, b) => a - b);
    const root = GraphicalTreeGenerate.recurseArrInsert(num, 0, num.length, createNode);
    updateNodePositions(root);
    GraphicalTreeGenerate.create(root);
    return root;
  }

  // Loads Tree from Data
  public static loadTree<T extends GraphicalBSTNode>(createNode: (number) => T, data: number[]): T {
    const size = data.length;
    const root = GraphicalTreeGenerate.constructTreeUtil(createNode, data, 0, size - 1);

    updateNodePositions(root);
    GraphicalTreeGenerate.create(root);
    return root;
  }

  // Construct tree from pre order
  public static constructTreeUtil(createNode, pre, low, high) {
    let preIndex: number = 0;
    function _constructTreeUtil(createNode, pre, low, high) {
      // Base Case
<<<<<<< HEAD
      if (low > high)
        return null
=======
      if (low > high) return null;
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250

      // The first node in preorder traversal is root. So take
      // the node at preIndex from pre[] and make it root,
      // and increment preIndex
<<<<<<< HEAD
      let root = createNode(pre[preIndex]);
=======
      const root = createNode(pre[preIndex]);
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
      preIndex++;

      // If the current subarray has only one element,
      // no need to recur
<<<<<<< HEAD
      if (low == high)
        return root

      let r_root = -1
=======
      if (low == high) return root;

      let r_root = -1;
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250

      // Search for the first element greater than root
      for (let i = low; i <= high; i++) {
        if (pre[i] > root._data.value) {
<<<<<<< HEAD
          r_root = i
          break
=======
          r_root = i;
          break;
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
        }
      }

      // If no elements are greater than the current root,
      // all elements are left children
      // so assign root appropriately
<<<<<<< HEAD
      if (r_root == -1)
        r_root = preIndex + (high - low)
=======
      if (r_root == -1) r_root = preIndex + (high - low);
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250

      // Use the index of element found in preorder to divide
      // preorder array in two parts. Left subtree and right
      // subtree
<<<<<<< HEAD
      root.left = _constructTreeUtil(createNode, pre, preIndex, r_root - 1)

      root.right = _constructTreeUtil(createNode, pre, r_root, high)

      return root
=======
      root.left = _constructTreeUtil(createNode, pre, preIndex, r_root - 1);

      root.right = _constructTreeUtil(createNode, pre, r_root, high);

      return root;
>>>>>>> 9664a69cb9210b8ac89d475b837fc4b5aac3b250
    }
    return _constructTreeUtil(createNode, pre, low, high);
  }
}

