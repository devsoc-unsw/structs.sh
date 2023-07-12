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

  private static recreateTree<T extends GraphicalBSTNode>(
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

  public static testgenerate<T extends GraphicalBSTNode>(createNode: (number) => T, data: number[]): T {
    const num = data;
    const root = createNode(num[0]);
    root.left = createNode(num[1]);

    GraphicalTreeGenerate.create(root);
    return root;
  }
}

