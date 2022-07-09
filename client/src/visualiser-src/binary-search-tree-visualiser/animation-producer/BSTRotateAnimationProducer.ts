import { Line } from '@svgdotjs/svg.js';
import BSTAnimationProducer from './BSTAnimationProducer';
import { Node } from '../util/typedefs';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import { rotateLeftCodeSnippet, rotateRightCodeSnippet } from '../util/codeSnippets';

export default class BSTRotateAnimationProducer extends BSTAnimationProducer {
  public renderRotateLeftCode(): void {
    this.renderCode(rotateLeftCodeSnippet);
  }

  public renderRotateRightCode(): void {
    this.renderCode(rotateRightCodeSnippet);
  }
}
