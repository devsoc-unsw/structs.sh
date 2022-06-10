import GraphicalLinkedList from 'visualiser-src/linked-list-visualiser/data-structure/GraphicalLinkedList';
import GraphicalBST from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalBST';
import GraphicalDataStructure from './GraphicalDataStructure';

class GraphicalDataStructureFactory {
  public static create(topicTitle: string): GraphicalDataStructure {
    switch (topicTitle.toLowerCase()) {
      case 'linked lists':
        return new GraphicalLinkedList();
      case 'binary search trees':
        return new GraphicalBST();
      case 'avl trees':
        return new GraphicalBST();
      default:
        throw Error('Invalid Topic Title');
    }
  }
}

export default GraphicalDataStructureFactory;
