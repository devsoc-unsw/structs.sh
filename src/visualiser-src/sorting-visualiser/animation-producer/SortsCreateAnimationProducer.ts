import { boxWidth, whitespace, textCy } from '../util/constants';
import { getX, getY, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsCreateAnimationProducer extends SortsAnimationProducer {
  public addBlock(value: number, length: number, newBlock: GraphicalSortsElement) {
    const rectX = getX(length);
    const rectY = getY(value);
    const textCx = getCx(length);

    newBlock.boxTarget.x(rectX).y(rectY);
    newBlock.numberTarget.cx(textCx).cy(textCy);
    newBlock.boxTarget.animate().attr({ opacity: 1 });
    newBlock.numberTarget.animate().attr({ opacity: 1 });
  }
}
