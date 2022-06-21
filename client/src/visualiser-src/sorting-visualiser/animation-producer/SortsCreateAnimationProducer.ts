import { boxWidth, whitespace } from '../util/constants';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsCreateAnimationProducer extends SortsAnimationProducer {
  public addBlock(value: number, length: number, newBlock: GraphicalSortsElement) {
    const rectX = length * (boxWidth + whitespace) + whitespace;
    const rectY = 350 - Math.sqrt(value * 90);
    const textCx = length * (boxWidth + whitespace) + (boxWidth / 2 + whitespace);
    const textCy = 360;

    newBlock.boxTarget.x(rectX).y(rectY);
    newBlock.numberTarget.cx(textCx).cy(textCy);
    newBlock.boxTarget.animate().attr({ opacity: 1 });
    newBlock.numberTarget.animate().attr({ opacity: 1 });
  }
}
