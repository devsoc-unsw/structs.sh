import { Line } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import {
  nodeStyle, nodeWidth, textStyle, lineStyle,
} from '../util/settings';

export default class BSTTraverseAnimationProducer extends BSTAnimationProducer {
  public renderInorderTraversalCode(): void {
    this.renderCode(
`if (node == NULL) {
  return;
}
inorderTraversal(node->left);
printf("%d ", node->val);
inorderTraversal(node->right);`
    );
  }

  public renderPreorderTraversalCode(): void {
    this.renderCode(
`if (node == NULL) {
  return;
}
printf("%d ", node->val);
preorderTraversal(node->left);
preorderTraversal(node->right);`
    );
  }

  public renderPostorderTraversalCode(): void {
    this.renderCode(
`if (node == NULL) {
  return;
}
postorderTraversal(node->left);
postorderTraversal(node->right);
printf("%d ", node->val);`
    );
  }
  
  public highlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#4beb9b',
        stroke: '#4beb9b',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      })
    );
  }
}
