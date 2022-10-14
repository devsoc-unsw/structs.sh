import { selectionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsSelectionAnimationProducer extends SortsAnimationProducer {
  public renderSelectionCode() {
    this.renderCode(selectionCodeSnippet);
  }
}
