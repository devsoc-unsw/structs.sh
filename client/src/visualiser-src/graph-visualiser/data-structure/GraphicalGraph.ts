// todo: RENAME THIS FILE INTO SOMETHING ELSE

import GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import { injectIds } from '@/visualiser-src/common/helpers';
import { Documentation } from '@/visualiser-src/common/typedefs';

export default class GraphicalGraph extends GraphicalDataStructure {
  // this stuff is for the LHS panel of the graphs page
  private static documentation: Documentation = injectIds({
    'add vertex': {
      args: ['value', 'index'],
      description: 'Create a value at the given index.',
    },
    'remove vertex': {
      args: ['value', 'index'],
      description: 'a value at the given index.',
    },
    'add edge': {
      args: ['index1', 'index2'],
      description: 'Add an edge between two vertices',
    },
    'remove edge': {
      args: ['index1', 'index2'],
      description: 'Remove an edge between two vertices.',
    },
    search: {
      args: ['value'],
      description: 'Search for a value in the linked list.',
    },
    delete: {
      args: ['index'],
      description: 'Delete a node by the index given.',
    },
  });

  public get documentation(): Documentation {
    return GraphicalGraph.documentation;
  }

  public generate(): void {
    // todo: implement
    // alert('hello world!');
    // throw new Error('Method not implemented.');
  }
}
