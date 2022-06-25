import { boxWidth, whitespace, textCy } from '../util/constants';
import helpers from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsCreateAnimationProducer extends SortsAnimationProducer {
  public addBlock(value: number, length: number, newBlock: GraphicalSortsElement) {
    const rectX = helpers.getX(length);
    const rectY = helpers.getY(value);
    const textCx = helpers.getCx(length);

    newBlock.boxTarget.x(rectX).y(rectY);
    newBlock.numberTarget.cx(textCx).cy(textCy);
    newBlock.boxTarget.animate().attr({ opacity: 1 });
    newBlock.numberTarget.animate().attr({ opacity: 1 });
  }
}
