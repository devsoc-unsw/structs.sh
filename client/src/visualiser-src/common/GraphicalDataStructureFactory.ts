import GraphicalLinkedList from 'visualiser-src/linked-list-visualiser/data-structure/GraphicalLinkedList';
import GraphicalBST from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalBST';
import GraphicalDataStructure from './GraphicalDataStructure';
import { DataStructure } from './typedefs';

class GraphicalDataStructureFactory {
  public static create(topicTitle: string): GraphicalDataStructure {
    switch (topicTitle.toLowerCase()) {
      case DataStructure.LINKED_LISTS:
        return new GraphicalLinkedList();
      case DataStructure.BINARY_SEARCH_TREE:
        return new GraphicalBST();
      case DataStructure.AVL_TREES:
        return new GraphicalBST();
      default:
        throw Error('Invalid Topic Title');
    }
  }
}

export default GraphicalDataStructureFactory;
