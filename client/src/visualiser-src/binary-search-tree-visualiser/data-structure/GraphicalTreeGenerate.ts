import { generateNumbers } from 'visualiser-src/common/RandomNumGenerator';
import GraphicalBSTNode from './GraphicalBSTNode';
import BSTCreateAnimationProducer from '../animation-producer/BSTCreateAnimationProducer';
import updateNodePositions from '../util/helpers';

export default class GraphicalTreeGenerate {
  // given a sorted array arr, inserts elements to num such that its linear insertion order
  // will lead to a reasonably balanced BST
  private static recurseArrInsert<T extends GraphicalBSTNode>(
    arr: number[],
    start: number,
    end: number,
    createNode: (arg0: number) => T
  ): T | null {
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

  private static create<T extends GraphicalBSTNode>(root: T | null): void {
    const producer = new BSTCreateAnimationProducer();
    producer.createTree(root);
  }

  public static generate<T extends GraphicalBSTNode>(createNode: (arg0: number) => T): T | null {
    const num = generateNumbers().sort((a, b) => a - b);
    const root = GraphicalTreeGenerate.recurseArrInsert(num, 0, num.length, createNode);
    updateNodePositions(root);
    GraphicalTreeGenerate.create(root);
    return root;
  }

  // Loads Tree from Data
  public static loadTree<T extends GraphicalBSTNode>(
    createNode: (arg0: number) => T,
    data: number[]
  ): T | null {
    const size = data.length;
    const root = GraphicalTreeGenerate.constructTreeUtil(createNode, data, 0, size - 1);

    updateNodePositions(root);
    GraphicalTreeGenerate.create(root);
    return root;
  }

  // Construct tree from pre order
  public static constructTreeUtil<T extends GraphicalBSTNode>(
    createNode: (arg0: number) => T,
    pre: number[],
    low: number,
    high: number
  ) {
    let preIndex: number = 0;
    function constructTreeRecursive(_pre: number[], _low: number, _high: number) {
      // Base Case
      if (_low > _high) return null;

      // The first node in preorder traversal is root. So take
      // the node at preIndex from pre[] and make it root,
      // and increment preIndex
      const root = createNode(_pre[preIndex]);
      preIndex++;

      // If the current subarray has only one element,
      // no need to recur
      if (_low === _high) return root;
      let rRoot = -1;

      // Search for the first element greater than root
      for (let i = _low; i <= _high; i++) {
        if (_pre[i] > root.value) {
          rRoot = i;
          break;
        }
      }

      // If no elements are greater than the current root,
      // all elements are left children
      // so assign root appropriately
      if (rRoot === -1) rRoot = preIndex + (_high - _low);

      // Use the index of element found in preorder to divide
      // preorder array in two parts. Left subtree and right
      // subtree
      root.left = constructTreeRecursive(_pre, preIndex, rRoot - 1);

      root.right = constructTreeRecursive(_pre, rRoot, _high);

      return root;
    }
    return constructTreeRecursive(pre, low, high);
  }
}
