import { insertionCodeSnippet } from '../util/codeSnippets';
import { getX, getCx } from '../util/helpers';
import GraphicalSortsElement from '../data-structure/GraphicalSortsElement';
import SortsAnimationProducer from './SortsAnimationProducer';

export default class SortsBubbleAnimationProducer extends SortsAnimationProducer {
    public renderInsertionCode() {
        this.renderCode(insertionCodeSnippet);
    }

}