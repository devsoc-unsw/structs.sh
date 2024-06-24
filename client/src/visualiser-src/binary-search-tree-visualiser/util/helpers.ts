import { VISUALISER_WORKSPACE_ID } from 'visualiser-src/common/constants';
import { lineDiffY, canvasPadding } from '../../common/settings';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';

// Updates node positions of a tree
const updateNodePositionsRecursive = (
  node: GraphicalBSTNode,
  low: number,
  high: number,
  mid: number,
  y: number
) => {
  if (node === null) {
    return;
  }

  node.x = mid;
  node.y = y;

  updateNodePositionsRecursive(node.left, low, mid, (low + mid) / 2, y + lineDiffY);
  updateNodePositionsRecursive(node.right, mid, high, (mid + high) / 2, y + lineDiffY);
};

const updateNodePositions = (root: GraphicalBSTNode): void => {
  const canvasWidth = document.getElementById(VISUALISER_WORKSPACE_ID).offsetWidth;
  const low: number = 0;
  const high: number = Number(canvasWidth);
  const mid: number = (low + high) / 2;
  updateNodePositionsRecursive(root, low, high, mid, canvasPadding);
};

export default updateNodePositions;
