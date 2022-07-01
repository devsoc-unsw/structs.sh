import GraphicalLinkedList from 'visualiser-src/linked-list-visualiser/data-structure/GraphicalLinkedList';
import GraphicalBST from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalBST';
import GraphicalSorts from 'visualiser-src/sorting-visualiser/data-structure/GraphicalSorts';
import GraphicalDataStructure from './GraphicalDataStructure';
import { DataStructure } from './typedefs';

class GraphicalDataStructureFactory {
  public static create(topicTitle: string): GraphicalDataStructure {
    switch (topicTitle.toLowerCase()) {
      case DataStructure.LINKED_LISTS.toLowerCase():
        return new GraphicalLinkedList();
      case DataStructure.BINARY_SEARCH_TREE.toLowerCase():
        return new GraphicalBST();
      case DataStructure.SORTING.toLowerCase():
        return new GraphicalSorts();
      default:
        throw Error('Invalid Topic Title');
    }
  }
}

export default GraphicalDataStructureFactory;
