// todo: RENAME THIS FILE INTO SOMETHING ELSE

import GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import { injectIds } from '@/visualiser-src/common/helpers';
import { Documentation } from '@/visualiser-src/common/typedefs';

export default class GraphicalGraph extends GraphicalDataStructure {
  private static documentation: Documentation = injectIds({});

  public get documentation(): Documentation {
    return GraphicalGraph.documentation;
  }

  public generate(): void {
    // todo: implement
    // alert('hello world!');
    // throw new Error('Method not implemented.');
  }
}
