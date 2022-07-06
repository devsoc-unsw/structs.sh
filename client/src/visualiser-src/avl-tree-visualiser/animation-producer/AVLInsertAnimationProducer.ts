import { Marker, SVG, Svg } from '@svgdotjs/svg.js';
import AVLAnimationProducer from './AVLAnimationProducer';
import { Node } from '../util/typedefs';
import { nodeStyle, textStyle, lineStyle } from '../util/settings';
import { markerLength, nodeDiameter, pathD, VISUALISER_CANVAS } from '../../common/constants';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import { insertCodeSnippet } from '../util/codeSnippets';
import BSTInsertAnimationProducer from 'visualiser-src/binary-search-tree-visualiser/animation-producer/BSTInsertAnimationProducer';

export default class AVLInsertAnimationProducer extends BSTInsertAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }
}
